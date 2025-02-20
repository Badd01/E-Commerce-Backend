import { z } from "zod";

const categoryValidationSchema = z.object({
  categoryName: z
    .string({
      required_error: "Category name is required",
      invalid_type_error: "Category name must be a string",
    })
    .max(100, { message: "Category name must be <= 100 characters" }),
});

const tagValidationSchema = z.object({
  categoryId: z.number({
    required_error: "Category id is required",
    invalid_type_error: "Category id must be a number",
  }),
  tagName: z
    .string({
      required_error: "Tag name is required",
      invalid_type_error: "Tag name must be a string",
    })
    .max(100, { message: "Tag name must be <= 100 characters" }),
});

const sizeValidationSchema = z.object({
  sizeName: z
    .string({
      required_error: "Size name is required",
      invalid_type_error: "Size name must be a string",
    })
    .max(10, { message: "Size name must be <= 10 characters" }),
});

const colorValidationSchema = z.object({
  colorName: z
    .string({
      required_error: "Color name is required",
      invalid_type_error: "Color name must be a string",
    })
    .max(30, { message: "Color name must be <= 30 characters" }),
});

export {
  tagValidationSchema,
  sizeValidationSchema,
  colorValidationSchema,
  categoryValidationSchema,
};
