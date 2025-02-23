import { Request, Response } from "express";
import { orderServices } from "../services/order.services";
import { productServices } from "../services/product.services";
import { orderUpdateValidation } from "../validations/product.validation";

const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productVariantId = Number(req.body.productVariantId);
  if (isNaN(productVariantId)) {
    res.status(400).json({
      success: false,
      message: "Invalid product variant ID",
    });
    return;
  }

  try {
    // Check cart exists
    let cartId: number;
    let cart = await orderServices.findCartByUserIdFromDB(userId);
    if (cart) {
      cartId = cart.id;
    } else {
      // Create new cart
      cart = await orderServices.createNewCart({ userId });
      cartId = cart.id;
    }
    // Check product still available
    const productVariant = await productServices.getSingleProductVariantFromDB(
      productVariantId
    );

    const product = await productServices.getSingleProductFromDB(
      productVariant.productId
    );
    if (
      !productVariant ||
      !product ||
      productVariant.quantity === 0 ||
      productVariant.isStock === false
    ) {
      res.status(400).json("Product variant is not available");
      return;
    }

    // Check cart item exists
    const cartItem = await orderServices.findCartItemFromDB(
      cartId,
      productVariantId
    );

    if (productVariant.quantity < (cartItem?.quantity || 0) + 1) {
      res.json({ message: "Product variant is not available" });
      return;
    }

    let userCart = {};
    if (cartItem) {
      // Update cart item
      const dataCartItem = {
        quantity: cartItem.quantity + 1,
        price: cartItem.price + productVariant.price,
      };
      userCart = await orderServices.updateCartItemFromDB(
        cartItem.id,
        dataCartItem
      );
    } else {
      // Create new cart item
      const dataCartItem = {
        cartId,
        productVariantId,
        quantity: 1,
        price: productVariant.price,
      };
      userCart = await orderServices.createNewCartItem(dataCartItem);
    }

    // Update cart total price and quantity
    const dataCart = {
      totalPrice: cart.totalPrice + productVariant.price,
      totalQuantity: cart.totalQuantity + 1,
    };

    await orderServices.updateCartIntoDB(cartId, dataCart);

    res.status(200).json({
      success: true,
      message: "Add to cart successfully!",
      data: cart,
      dataItem: userCart,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const cart = await orderServices.findCartByUserIdFromDB(userId);
    if (!cart) {
      res.status(400).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }

    const cartItem = await orderServices.findCartItemByCartIdFromDB(cart.id);
    res.status(200).json({
      success: true,
      message: "Get cart successfully!",
      data: cart,
      dataItem: cartItem,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const address = (req as any).user.address;
  console.log(userId, address);

  try {
    const cart = await orderServices.findCartByUserIdFromDB(userId);
    const cartItem = await orderServices.findCartItemByCartIdFromDB(cart.id);
    if (!cart || cartItem.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }

    const dataOrder = {
      userId: userId,
      address: address,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
    };
    const result = await orderServices.createNewOrder(dataOrder);

    const dataOrderItem = cartItem.map((item) => ({
      orderId: result.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      price: item.price,
    }));
    const orderItem = await orderServices.createNewOrderItem(dataOrderItem);
    await orderServices.deleteCartFromDB(cart.id);

    for (const item of cartItem) {
      const productVariant =
        await productServices.getSingleProductVariantFromDB(
          item.productVariantId
        );
      const product = await productServices.getSingleProductFromDB(
        productVariant.productId
      );

      const dataProductVariant = {
        quantity: productVariant.quantity - item.quantity,
      };
      await productServices.updateProductVariantIntoDB(
        item.productVariantId,
        dataProductVariant
      );

      const dataProduct = {
        sold: product.sold + item.quantity,
      };
      await productServices.updateProductIntoDB(product.id, dataProduct);
    }

    res.status(200).json({
      success: true,
      message: "Create order successfully!",
      data: result,
      dataItem: orderItem,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const order = await orderServices.findOrderByUserIdFromDB(userId);
    res.status(200).json({
      success: true,
      message: "Get order successfully!",
      data: order,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getOrderDetail = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
    return;
  }

  try {
    const order = await orderServices.findOrderItemByOrderIdFromDB(orderId);
    res.status(200).json({
      success: true,
      message: "Get order successfully!",
      data: order,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({
      success: false,
      message: "Invalid order id",
    });
    return;
  }

  const { success, data, error } = await orderUpdateValidation.safeParse(
    req.body
  );
  if (!success) {
    res.status(400).json({
      success: false,
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  try {
    const result = await orderServices.updateOrderIntoDB(orderId, data);
    res.status(200).json({
      success: true,
      message: "Update order successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const cart = await orderServices.findCartByUserIdFromDB(userId);
    if (!cart) {
      res.status(400).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }
    await orderServices.deleteCartFromDB(cart.id);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const orderController = {
  addToCart,
  getCart,
  createOrder,
  getOrder,
  getOrderDetail,
  deleteCart,
  updateOrder,
};
