interface TProduct {
  productName: string;
  tagId: number;
  price: number;
  finalPrice: number;
  discount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TCategory {
  categoryName: string;
}

interface TTag {
  categoryId: number;
  tagName: string;
}

interface TSize {
  sizeName: string;
}

interface TColor {
  colorName: string;
}

interface TProductVariant {
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  isStock: boolean;
}

interface TProductImage {
  productId: number;
  colorId: number;
  imageUrl: string;
  publicId: string;
}

export {
  TCategory,
  TColor,
  TProduct,
  TProductVariant,
  TSize,
  TTag,
  TProductImage,
};
