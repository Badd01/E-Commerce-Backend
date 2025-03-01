import config from "./config";
import cors from "cors";
import express, { Request, Response } from "express";
import { productRoutes } from "./routes/product.routes";
import { attributesRoutes } from "./routes/attributes.routes";
import { userRoutes } from "./routes/user.routes";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// import authRoutes from './routes/auth';
// import productRoutes from './routes/products';
// import cartRoutes from './routes/cart';
// import orderRoutes from './routes/orders';
// import reviewRoutes from './routes/reviews';
// import statsRoutes from './routes/stats';

const app = express();

// Middleware
app.use(morgan("dev")); // Logger
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "http://localhost:1000",
    credentials: true,
  })
); // Enable CORS

// Routes
app.use("/api/product", productRoutes);
app.use("/api/attribute", attributesRoutes);
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

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/stats', statsRoutes);

// export default app;
