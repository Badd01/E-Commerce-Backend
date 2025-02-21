import config from "./config";
import cors from "cors";
import express, { Request, Response } from "express";
import { productRoutes } from "./routes/product.routes";
import { attributesRoutes } from "./routes/attributes.routes";
import { userRoutes } from "./routes/user.routes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app = express();

// Middleware
app.use(morgan("dev")); // Logger
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/attribute", attributesRoutes);

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
