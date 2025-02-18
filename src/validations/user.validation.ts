import { z } from "zod";

const userValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone numbe must be a string",
    })
    .length(10, { message: "Phone number must be exactly 10 characters long" }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  role: z
    .enum(["User", "Admin"], {
      message: "Role must be either: User or Admin",
    })
    .optional(),
  revenue: z
    .number({
      required_error: "Revenue is required",
      invalid_type_error: "Revenue must be a number",
    })
    .optional(),
  createdAt: z.coerce.date({ message: "Invalid date" }).optional(), // coerce date values
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
  refreshToken: z
    .string({ invalid_type_error: "Refresh token must be a string" })
    .optional(),
});

const userUpdateValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone numbe must be a string",
    })
    .length(10, { message: "Phone number must be exactly 10 characters long" }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  refreshToken: z.string({
    invalid_type_error: "Refresh token must be a string",
  }),
});

export { userValidationSchema, userUpdateValidationSchema };
