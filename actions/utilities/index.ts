import { UserSignupDataError, IUserSignupData } from "@/actions/auth";
import { z } from "zod";

export function parseUserSignupDataErrors(
  errors: z.ZodIssue[]
): UserSignupDataError {
  const formErrors = {} as UserSignupDataError;
  if (!errors.length) {
    formErrors;
  }
  for (let error of errors) {
    const errorKey = error.path[0] as keyof IUserSignupData;
    const errorMessage = error.message;
    const existingErrorMessages = formErrors[errorKey];
    if (existingErrorMessages) {
      existingErrorMessages.push(errorMessage);
    } else {
      formErrors[errorKey] = [errorMessage];
    }
  }

  return formErrors;
}
