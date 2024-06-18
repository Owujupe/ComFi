import { error } from "console";
import logger from "@/backend/shared/services/logger";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { IDecodedToken } from "@/backend/fiat/interface/decoded-token";
import {
  deleteEmailVerification,
  findEmailVerification,
  updateUserVerificationStatus,
} from "@/backend/fiat/services/email-verification";
import { createAuthSession } from "@/backend/fiat/services/auth";

export async function GET(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET!;
  const url = new URL(request.url);

  const token = url.searchParams.get("token") as string;

  if (!token) {
    return Response.json({ error: "No token found" }, { status: 400 });
  }

  if (!JWT_SECRET) {
    logger.error(`JWT_SECRET is not set in environment variables`);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IDecodedToken;

    const emailVerificationResult = await findEmailVerification(
      token,
      decoded.email
    );

    if (!emailVerificationResult) {
      return Response.json({ error: "Invalid Token" }, { status: 400 });
    }

    await deleteEmailVerification(emailVerificationResult.id);
    const user = await updateUserVerificationStatus(decoded.email);
    await createAuthSession(user.email);
    const url = new URL(process.env.NEXT_PUBLIC_HOST!);

    return Response.redirect(new URL(url), 302);
  } catch (error: any) {
    logger.error(`Error verifying email error=${error}`);
    return Response.json({
      error: error.message,
    });
  }
}
