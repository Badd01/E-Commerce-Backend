import { z } from "zod";

const productValidationSchema = z.object({
  productName: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .max(100, { message: "Product name must be <= 100 characters" }),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .toLowerCase(),
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
  brandId: z.number({
    required_error: "Brand id is required",
    invalid_type_error: "Brand must be a number",
  }),
  totalRating: z
    .number({
      invalid_type_error: "Rating must be a number",
    })
    .nonnegative({ message: "Rating must be >= 0" })
    .lte(5, { message: "Rating must be <= 5" })
    .optional(),
  sold: z
    .number({
      required_error: "Sold is required",
      invalid_type_error: "Sold must be a number",
    })
    .nonnegative({ message: "Rating must be >= 0" })
    .optional(),
  createdAt: z.coerce.date({ message: "Invalid date" }).optional(), // coerce date values
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
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
  createdAt: z.coerce.date({ message: "Invalid date" }).optional(), // coerce date values
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
});

const productImageValidationSchema = z.object({
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

const ratingValidationSchema = z.object({
  productId: z.number({
    required_error: "Product id is required",
    invalid_type_error: "Product id must be a number",
  }),
  userId: z.number({
    required_error: "User id is required",
    invalid_type_error: "User id must be a number",
  }),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .nonnegative({ message: "Rating must be >= 0" })
    .lte(5, { message: "Rating must be <= 5" }),
});

export {
  productValidationSchema,
  productVariantValidationSchema,
  productImageValidationSchema,
  ratingValidationSchema,
};
