interface TProduct {
  productName: string;
  slug: string;
  tagId: number;
  brandId: number;
  totalRating?: number;
  sold?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TProductUpdate {
  productName?: string;
  slug?: string;
  sold?: number;
  updatedAt?: Date;
}

interface TProductFilter {
  tagId?: number;
  brandId?: number;
  sortBy?: "name" | "price" | "time";
  sortOrder?: "asc" | "desc";
  page?: number;
}

interface TProductVariant {
  productId: number;
  sizeId: number;
  colorId: number;
  price: number;
  quantity: number;
  isStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TProductVariantUpdate {
  price?: number;
  quantity?: number;
  isStock?: boolean;
  updatedAt?: Date;
}

interface TProductImage {
  productId: number;
  colorId: number;
  imageUrl: string;
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TProductImageUpdate {
  imageUrl?: string;
  publicId?: string;
  updatedAt?: Date;
}

interface TRating {
  productId: number;
  userId: number;
  rating: number;
  createdAt?: Date;
}

export {
  TProduct,
  TProductVariant,
  TProductImage,
  TRating,
  TProductFilter,
  TProductVariantUpdate,
  TProductUpdate,
  TProductImageUpdate,
};
