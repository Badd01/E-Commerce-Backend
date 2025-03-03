import { z } from "zod";

export const orderSchema = z.object({
  userId: z.number({
    required_error: "User id is required",
    invalid_type_error: "User id must be a number",
  }),
  totalAmount: z.number({
    required_error: "Total amount is required",
    invalid_type_error: "Total amount must be a number",
  }),
  shippingAddress: z.string({
    required_error: "Shipping address is required",
    invalid_type_error: "Shipping address must be a string",
  }),
  shippingPhone: z
    .string({
      required_error: "Shipping phone is required",
      invalid_type_error: "Shipping phone must be a string",
    })
    .regex(/^\d{10,11}$/, { message: "Invalid phone number" }),
  status: z
    .enum(["Pending", "Shipped", "Delivered", "Cancelled"], {
      invalid_type_error:
        "Status must be a enum: Pending, Shipped, Delivered, Cancelled",
    })
    .default("Pending"),
});

export const createOrderSchema = z.object({
  shippingAddress: z
    .string({
      invalid_type_error: "Shipping address must be a string",
    })
    .optional(),
  shippingPhone: z
    .string({
      invalid_type_error: "Shipping phone must be a string",
    })
    .regex(/^\d{10,11}$/, { message: "Invalid phone number" })
    .optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"], {
    required_error: "Status is required",
    invalid_type_error:
      "Status must be a enum: Pending, Shipped, Delivered, Cancelled",
  }),
});
