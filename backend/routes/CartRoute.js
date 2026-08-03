import { Router } from "express";
import {
  addToCart,
  cartItems,
  removeFromCart,
  updateQuantity,
} from "../controllers/CartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyToken);

router.post("/add", addToCart);
router.get("/get-item", cartItems);
router.put("/update", updateQuantity);
router.delete("/remove/:productId", removeFromCart);

export default router;