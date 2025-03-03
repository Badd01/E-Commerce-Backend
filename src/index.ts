import express from "express";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes";
import { usersRoutes } from "./routes/users.routes";
import morgan from "morgan";
import cors from "cors";
import { productsRoutes } from "./routes/products.routes";
import { cartsRoutes } from "./routes/carts.routes";
import { ordersRoutes } from "./routes/orders.routes";
import { PORT } from "./utils/config";

const app = express();

// Middleware
app.use(morgan("dev")); // Logger
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:1000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
