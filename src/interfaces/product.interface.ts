interface TProduct {
  productName: string;
  slug: string;
  tagId: number;
  price: number;
  brandId: number;
  totalRating?: number;
  sold?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TProductVariant {
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  isStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TProductImage {
  productId: number;
  colorId: number;
  imageUrl: string;
  publicId: string;
}

interface TRating {
  productId: number;
  userId: number;
  rating: number;
}

export { TProduct, TProductVariant, TProductImage, TRating };
