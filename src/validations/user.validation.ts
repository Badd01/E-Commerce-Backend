import { z } from "zod";

const userValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        "Password must be at least 8 characters long and include both letters and numbers",
    }),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a string",
    })
    .regex(/^\d{10,11}$/, {
      message: "Invalid phone number",
    }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  role: z
    .enum(["User", "Admin"], {
      message: "Role must be either: User or Admin",
    })
    .optional(),
  refreshToken: z
    .string({ invalid_type_error: "Refresh token must be a string" })
    .optional(),
  passwordChangedAt: z.coerce.date({ message: "Invalid date" }).optional(),
  passwordResetToken: z
    .string({
      invalid_type_error: "Password reset token must be a string",
    })
    .optional(),
  passwordResetExpires: z.coerce.date({ message: "Invalid date" }).optional(),
});

const userUpdateValidation = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  phoneNumber: z.string().regex(/^\d{10,11}$/, {
    message: "Invalid phone number",
  }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
});

const userChangePasswordValidation = z.object({
  oldPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: "Not match password",
  }),
  newPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      "Password must be at least 8 characters long and include both letters and numbers",
  }),
});

const userEmailValidation = z.object({
  to: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }),
  subject: z.string({
    required_error: "Subject is required",
    invalid_type_error: "Subject must be a string",
  }),
  text: z.string({
    required_error: "Text is required",
    invalid_type_error: "Text must be a string",
  }),
  html: z.string({
    required_error: "HTML is required",
    invalid_type_error: "HTML must be a string",
  }),
});

export {
  userValidationSchema,
  userUpdateValidation,
  userEmailValidation,
  userChangePasswordValidation,
};
