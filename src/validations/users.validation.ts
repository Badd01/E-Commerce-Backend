import { z } from "zod";

export const updateUserSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .optional(),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string",
    })
    .regex(/^\d{10,11}$/, {
      message: "Invalid phone number",
    })
    .optional(),
  address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["Admin", "User"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be a enum: Admin, User",
  }),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string({
    required_error: "Old password is required",
    invalid_type_error: "Old password must be a string",
  }),
  newPassword: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a string",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message:
        "New password must be at least 8 characters long and include both letters and numbers",
    }),
});

export const userIdSchema = z.object({
  id: z
    .number({
      required_error: "User id is required",
      invalid_type_error: "User id must be a number",
    })
    .int({ message: "User id must be a integer" })
    .positive({ message: "User id must be > 0" }),
});

export const reviewsSchema = z.object({
  productId: z
    .number({
      required_error: "Product id is required",
      invalid_type_error: "Product id must be a number",
    })
    .int({ message: "Product id must be a integer" })
    .positive({ message: "Product id must be > 0" }),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .int({ message: "Rating must be a integer" })
    .min(1, { message: "Rating must be between 1 and 5" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment must be a string",
    })
    .optional(),
});
