"use server";

import { createUserSchema } from "@/actions/schema";
import { parseUserSignupDataErrors } from "@/actions/utilities";
import { hashPassword } from "@/backend/fiat/lib/hash";
import prisma from "@/backend/fiat/lib/db";
import { createAuthSession } from "@/backend/fiat/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UNIQUE_CONSTRAINT_FAILED } from "@/backend/fiat/constants/db-violation-codes";
import logger from "@/backend/shared/services/logger";
export interface IUserSignupData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export type UserSignupDataError = {
  [key in keyof IUserSignupData]: string[];
};

export async function signup(
  prevState: UserSignupDataError,
  formData: FormData
) {
  const formErrors = {} as UserSignupDataError;

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

  console.log(userData);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    await createAuthSession(user.id);

    redirect("/");
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === UNIQUE_CONSTRAINT_FAILED) {
        logger.info("Email Already Exists");
        return { email: ["Email already exists"] };
      }
    }

    throw error;
  }
}
