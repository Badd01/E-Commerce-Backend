import { z } from "zod";

const productValidationSchema = z.object({
  productName: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .max(100, { message: "Product name must be <= 100 characters" }),
  tagId: z.number({
    required_error: "Tag id is required",
    invalid_type_error: "Tag id must be a number",
  }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({ message: "Price must be >= 0" }),
  finalPrice: z
    .number({
      required_error: "Final price is required",
      invalid_type_error: "Final price must be a number",
    })
    .nonnegative({ message: "Price must be >= 0" }),
  discount: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({ message: "Discount must be >= 0" })
    .lte(1, { message: "Discount must be <= 1" }),
  rating: z
    .number({
      invalid_type_error: "Rating must be a number",
    })
    .nonnegative({ message: "Rating must be >= 0" })
    .lte(5, { message: "Rating must be <= 5" }),
  createdAt: z.coerce.date({ message: "Invalid date" }), // coerce date values
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
});

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

const productVariantValidationSchema = z.object({
  productId: z.number({
    required_error: "Product id is required",
    invalid_type_error: "Product id must be a number",
  }),
  sizeId: z.number({
    required_error: "Size id is required",
    invalid_type_error: "Size id must be a number",
  }),
  colorId: z.number({
    required_error: "Color id is required",
    invalid_type_error: "Color id must be a number",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .nonnegative({ message: "Quantity must be >= 0" }),
  isStock: z.boolean({
    required_error: "Is stock is required",
    invalid_type_error: "Is stock must be a boolean",
  }),
});

const productImageSchema = z.object({
  productId: z.number({
    required_error: "Product id is required",
    invalid_type_error: "Product id must be a number",
  }),
  colorId: z.number({
    required_error: "Color id is required",
    invalid_type_error: "Color id must be a number",
  }),
  imageUrl: z.string({
    required_error: "Image url is required",
    invalid_type_error: "Image url must be a string",
  }),
  publicId: z.string({
    required_error: "Public id is required",
    invalid_type_error: "Public id must be a string",
  }),
});

export {
  productValidationSchema,
  productVariantValidationSchema,
  tagValidationSchema,
  sizeValidationSchema,
  colorValidationSchema,
  categoryValidationSchema,
  productImageSchema,
};
