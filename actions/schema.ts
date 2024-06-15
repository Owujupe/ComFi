import { z } from "zod";

const requiredStringField = (fieldName: string, type = "string") => ({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a valid ${type}`,
});

export const createUserSchema = z
  .object({
    firstName: z
      .string(requiredStringField("First Name"))
      .min(3, { message: "First Name must be at least 3 characters long" }),
    lastName: z
      .string(requiredStringField("Last Name"))
      .min(3, { message: "Last Name must be at least 3 characters long" }),
    email: z
      .string(requiredStringField("Email", "email"))
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one digit" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: z.ZodIssueCode.custom,
      });
    }
  });
