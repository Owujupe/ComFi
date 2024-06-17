export * from "./hash";

export function isNotExpired(expiryDate: string | Date): boolean {
  return new Date() < new Date(expiryDate);
}
