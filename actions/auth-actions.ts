"use server";

import { createUserSchema } from "@/actions/schema";
import { parseUserSignupDataErrors } from "@/actions/utilities";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UNIQUE_CONSTRAINT_FAILED } from "@/backend/fiat/constants/db-violation-codes";
import logger from "@/backend/shared/services/logger";
import { randomBytes } from "crypto";
import { hashPassword, verifyPassword } from "@/backend/fiat/utils";
import jwt from "jsonwebtoken";
import prisma from "@/backend/fiat/lib/database";
import { sendEmail } from "@/backend/fiat/lib/email";
import { createAuthSession } from "@/backend/fiat/services/auth";
export interface IUserSignupData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ILoginError {
  message: string;
}

export type UserSignupDataError = {
  [key in keyof IUserSignupData]: string[];
};

export async function signup(
  prevState: UserSignupDataError,
  formData: FormData
) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const userData = { firstName, lastName, email, password, confirmPassword };
  const validationResult = createUserSchema.safeParse(userData);

  if (validationResult.error) {
    return parseUserSignupDataErrors(validationResult.error.errors);
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    logger.info(
      `User userId=${user.id} userFirstName=${user.firstName} successsfully added to DB`
    );

    const code = randomBytes(32).toString("hex");

    const token = jwt.sign(
      { email: user.email, code },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        verificationToken: token,
      },
    });

    const url = `${process.env.NEXT_PUBLIC_HOST}/api/fiat/verify-email?token=${token}`;

    await sendEmail(
      email,
      "Verify your email",
      `<a href=${url}>Click here to verify</a>`
    );

    redirect("/");
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === UNIQUE_CONSTRAINT_FAILED) {
        logger.info(`User Email ${userData.email} already exists`);
        return { email: ["Email already exists"] };
      }
    }

    throw error;
  }
}

export async function login(prevState: ILoginError, formData: FormData) {
  const formErrors = {} as ILoginError;
  const wrongCredentialErrorMessage = `Combination of password and email are incorrect`;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const user = await prisma.user.findFirst({ where: { email: email } });

  if (!user) {
    formErrors.message = wrongCredentialErrorMessage;
    return formErrors;
  }

  if (!user.isVerified) {
    formErrors.message = `Email needs to be verified.`;
    return formErrors;
  }

  const hashPassword = user.password;
  const passwordValid = await verifyPassword(password, hashPassword);
  if (!passwordValid) {
    formErrors.message = wrongCredentialErrorMessage;
    return formErrors;
  }

  try {
    await createAuthSession(email);
  } catch (error: unknown) {
    const err = error;
    throw error;
  }

  redirect("/");
}
