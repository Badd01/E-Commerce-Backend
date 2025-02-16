import { z } from "zod";

const orderItemValidationSchema = z.object({
  productId: z.number({
    required_error: "Product id is required",
    invalid_type_error: "Product id must be a number",
  }),
  productVariantId: z.number({
    required_error: "Product variant id is required",
    invalid_type_error: "Product variant id must be a number",
  }),
  orderId: z.number({
    required_error: "Order id is required",
    invalid_type_error: "Order id must be a number",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .nonnegative({ message: "Quantity must be >=1" }),
  unitPrice: z
    .number({
      required_error: "Unit price is required",
      invalid_type_error: "Unit price must be a number",
    })
    .nonnegative({ message: "Unit price must be >= 0" }),
  totalPrice: z
    .number({
      required_error: "Total price is required",
      invalid_type_error: "Total price must be a number",
    })
    .nonnegative({ message: "Total price must be >= 0" }),
});

const orderValidationSchema = z.object({
  userId: z.number({
    required_error: "User id is required",
    invalid_type_error: "User id must be a number",
  }),
  finalPrice: z.number({
    required_error: "Final price is required",
    invalid_type_error: "Final price must be a number",
  }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a number",
    })
    .length(10),
  status: z.enum(["pending", "processing", "completed", "cancelled"], {
    message:
      "Status must be either: pending or processing or completed cancelled",
  }),
  createdAt: z.coerce.date({ message: "Invalid date" }).optional(), // coerce date values
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
});

export { orderItemValidationSchema, orderValidationSchema };
