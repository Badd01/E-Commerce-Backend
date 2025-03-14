import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string().optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price must be > 0" }),
  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int({ message: "Stock must be a integer" })
    .nonnegative({ message: "Stock must be >= 0" }),
  categoryId: z
    .number({
      required_error: "Category id is required",
      invalid_type_error: "Category id must be a number",
    })
    .int({ message: "Category id must be a integer" })
    .positive({
      message: "Category id must be > 0",
    }),
  tagId: z
    .number({
      required_error: "Tag id is required",
      invalid_type_error: "Tag id must be a number",
    })
    .int({ message: "Tag id must be a integer" })
    .positive({ message: "Tag id must be > 0" }),
  colorId: z
    .number({
      required_error: "Color id is required",
      invalid_type_error: "Color id must be a number",
    })
    .int({ message: "Color id must be a integer" })
    .positive({ message: "Color id must be > 0" }),
  yearId: z
    .number({
      required_error: "Year id is required",
      invalid_type_error: "Year id must be a number",
    })
    .int({ message: "Year id must be a integer" })
    .positive({
      message: "Year id must be > 0",
    }),
});

export const productIdSchema = z.object({
  id: z
    .number({
      required_error: "Product id is required",
      invalid_type_error: "Product id must be a number",
    })
    .int({ message: "Product id must be a integer" })
    .positive({ message: "Product id must be > 0" }),
});
