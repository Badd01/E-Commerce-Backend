import config from "./config";
import cors from "cors";
import express from "express";
import { productRoutes } from "./routes/product.routes";
import { userRoutes } from "./routes/user.routes";

const app = express();

// MIddleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
// app.use("/api/users");
app.use("/api/users", userRoutes);

async function main() {
  app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
  });
}

main();
