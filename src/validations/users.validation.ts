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

export const reviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .int()
    .min(1, { message: "Rating must be between 1 and 5" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment must be a string",
    })
    .optional(),
  productId: z
    .number({
      required_error: "Product id is required",
      invalid_type_error: "Product id must be a number",
    })
    .int(),
  userId: z
    .number({
      required_error: "User id is required",
      invalid_type_error: "User id must be a number",
    })
    .int(),
});
