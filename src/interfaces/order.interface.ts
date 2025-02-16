interface TOrderItem {
  productId: number;
  productVariantId: number;
  orderId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface TOrder {
  userId: number;
  finalPrice: number;
  address: string;
  phoneNumber: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export { TOrder, TOrderItem };
