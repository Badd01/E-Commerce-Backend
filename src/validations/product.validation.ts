import { z } from "zod";

const productValidationSchema = z.object({
  productName: z.string({
    required_error: "Product name is required",
    invalid_type_error: "Product name must be a string",
  }),
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
  brandId: z.number({
    required_error: "Brand id is required",
    invalid_type_error: "Brand must be a number",
  }),
  totalRating: z
    .number({
      invalid_type_error: "Total rating must be a number",
    })
    .nonnegative({ message: "Total rating must be >= 0" })
    .lte(5, { message: "Total rating must be <= 5" })
    .optional(),
  totalSold: z
    .number({
      invalid_type_error: "Total sold must be a number",
    })
    .nonnegative({ message: "Total sold must be >= 0" })
    .optional(),
});

const productUpdateValidation = z.object({
  productName: z
    .string({
      invalid_type_error: "Product name must be a string",
    })
    .optional(),
  slug: z
    .string({
      invalid_type_error: "Slug must be a string",
    })
    .optional(),
  sold: z
    .number({
      invalid_type_error: "Total sold must be a number",
    })
    .optional(),
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
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({ message: "Price must be >= 0" }),
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

const productVariantUpdateValidation = z.object({
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .nonnegative({ message: "Price must be >= 0" })
    .optional(),
  quantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .nonnegative({ message: "Quantity must be >= 0" })
    .optional(),
  isStock: z
    .boolean({
      invalid_type_error: "Is stock must be a boolean",
    })
    .optional(),
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

const productImageUpdateValidation = z.object({
  imageUrl: z
    .string({
      invalid_type_error: "Image url must be a string",
    })
    .optional(),
  publicId: z
    .string({
      invalid_type_error: "Public id must be a string",
    })
    .optional(),
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
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

const orderUpdateValidation = z.object({
  status: z.enum(
    ["pending", "cancelled", "processing", "on delivery", "completed"],
    {
      required_error: "Status is required",
      invalid_type_error: "Status must be a string",
    }
  ),
  updatedAt: z.coerce.date({ message: "Invalid date" }).optional(),
});

export {
  productValidationSchema,
  productVariantValidationSchema,
  productImageValidationSchema,
  productVariantUpdateValidation,
  ratingValidationSchema,
  productUpdateValidation,
  productImageUpdateValidation,
  orderUpdateValidation,
};
