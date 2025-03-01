import { z } from "zod";

export const productSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
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
    .int()
    .nonnegative({ message: "Stock must be >= 0" }),
  categoryId: z
    .number({
      required_error: "Category id is required",
      invalid_type_error: "Category id must be a number",
    })
    .int(),
  tagId: z
    .number({
      required_error: "Tag id is required",
      invalid_type_error: "Tag id must be a number",
    })
    .int(),
  colorId: z
    .number({
      required_error: "Color id is required",
      invalid_type_error: "Color id must be a number",
    })
    .int(),
  seasonId: z
    .number({
      required_error: "Season id is required",
      invalid_type_error: "Season id must be a number",
    })
    .int(),
  yearId: z
    .number({
      required_error: "Year id is required",
      invalid_type_error: "Year id must be a number",
    })
    .int(),
  purposeId: z
    .number({
      required_error: "Purpose id is required",
      invalid_type_error: "Purpose id must be a number",
    })
    .int(),
});
