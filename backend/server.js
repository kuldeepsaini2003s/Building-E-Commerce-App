import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRoutes from "./routes/UserRoute.js";
import shopRoutes from "./routes/ShopRoute.js";
import productRoutes from "./routes/ProductRoute.js";
import EventRoutes from "./routes/EventRoute.js";
import CartRoutes from "./routes/CartRoute.js";
import WishlistRoutes from "./routes/WishlistRoute.js";
import CouponCodeRoutes from "./routes/CouponCodeRoute.js";
import OrderRoutes from "./routes/OrderRoute.js";

dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [process.env.LOCAL_ORIGIN, process.env.FE_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/event", EventRoutes);
app.use("/api/v1/couponCode", CouponCodeRoutes);
app.use("/api/v1/cart", CartRoutes);
app.use("/api/v1/wishlist", WishlistRoutes);
app.use("/api/v1/order", OrderRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listing on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting MongoDB", error);
  });
