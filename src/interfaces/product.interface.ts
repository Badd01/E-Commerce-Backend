interface TProduct {
  productName: string;
  slug: string;
  tagId: number;
  price: number;
  brand: string;
  rating?: number;
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

export { TProduct, TProductVariant, TProductImage };
