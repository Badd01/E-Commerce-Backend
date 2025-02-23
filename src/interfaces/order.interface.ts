interface TCart {
  userId: number;
  totalPrice?: number;
  totalQuantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TCartUpdate {
  totalPrice: number;
  totalQuantity: number;
  updatedAt?: Date;
}

interface TCartItem {
  cartId: number;
  productVariantId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TCartItemUpdate {
  quantity: number;
  updatedAt?: Date;
}

interface TOrderItem {
  orderId: number;
  productVariantId: number;
  quantity: number;
  price: number;
}

interface TOrder {
  userId: number;
  address: string;
  totalQuantity: number;
  totalPrice: number;
  paymentMethod?: "COD";
  status?: "pending" | "cancelled" | "processing" | "on delivery" | "completed";
  orderDate?: Date;
  updatedAt?: Date;
}

interface TOrderUpdate {
  status: "pending" | "processing" | "on delivery" | "cancelled" | "completed";
  updatedAt?: Date;
}

export {
  TCart,
  TOrder,
  TOrderItem,
  TCartItem,
  TOrderUpdate,
  TCartItemUpdate,
  TCartUpdate,
};
