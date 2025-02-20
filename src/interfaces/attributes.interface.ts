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

export { TCategory, TColor, TSize, TTag };
