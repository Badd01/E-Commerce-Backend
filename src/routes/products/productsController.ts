import { Request, Response } from "express";

export function listProducts(req: Request, res: Response) {
  res.send("3");
}

export function getProducts(req: Request, res: Response) {
  res.send("2");
}

export function createProduct(req: Request, res: Response) {
  console.log(req.body);
  res.send("1");
}

export function updateProduct(req: Request, res: Response) {
  res.send("0");
}

export function deleteProduct(req: Request, res: Response) {
  res.send("-1");
}
