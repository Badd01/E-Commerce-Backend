import { z } from "zod";

const categoryValidationSchema = z.object({
  categoryName: z.string({
    required_error: "Category name is required",
    invalid_type_error: "Category name must be a string",
  }),
});
const brandValidationSchema = z.object({
  brandName: z.string({
    required_error: "Brand name is required",
    invalid_type_error: "Brand name must be a string",
  }),
});

const tagValidationSchema = z.object({
  categoryId: z.number({
    required_error: "Category id is required",
    invalid_type_error: "Category id must be a number",
  }),
  tagName: z.string({
    required_error: "Tag name is required",
    invalid_type_error: "Tag name must be a string",
  }),
});

const sizeValidationSchema = z.object({
  sizeName: z.string({
    required_error: "Size name is required",
    invalid_type_error: "Size name must be a string",
  }),
});

const colorValidationSchema = z.object({
  colorName: z.string({
    required_error: "Color name is required",
    invalid_type_error: "Color name must be a string",
  }),
});

export {
  tagValidationSchema,
  sizeValidationSchema,
  colorValidationSchema,
  categoryValidationSchema,
  brandValidationSchema,
};
