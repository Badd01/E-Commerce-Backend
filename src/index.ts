import config from "./config";
import cors from "cors";
import express, { Request, Response } from "express";
import { productRoutes } from "./routes/product.routes";
import { userRoutes } from "./routes/user.routes";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);

// Not Found
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Page Not Found" });
});

// Start server
async function main() {
  app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
  });
}

main();
