import express, { json, urlencoded } from "express";
import productsRoutes from "./routes/products";

const port = 3000;
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/products", productsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
