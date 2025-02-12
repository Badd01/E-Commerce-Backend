interface TProduct {
  productName: string;
  tagId: number;
  price: number;
  finalPrice: number;
  discount: number;
  rating?: number;
  createdAt: Date;
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
  productImage: string;
  quantity: number;
  isStock: boolean;
}

export { TCategory, TColor, TProduct, TProductVariant, TSize, TTag };
