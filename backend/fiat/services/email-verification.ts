import prisma from "@/backend/fiat/lib/database";

export async function findEmailVerification(token: string, email: string) {
  return await prisma.emailVerification.findFirst({
    where: { verificationToken: token, user: { email } },
  });
}

export async function deleteEmailVerification(id: string) {
  await prisma.emailVerification.delete({ where: { id } });
}

export async function updateUserVerificationStatus(email: string) {
  return await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
}
