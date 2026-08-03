import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getSellerAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrder,
  verifyPayment,
} from "../controllers/OrderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyToken);

router.post("/createOrder", createOrder);
router.post("/verifyPayment", verifyPayment);
router.get("/all-orders", getAllOrders);
router.get("/get-seller-all-orders/:shopId", getSellerAllOrders);
router.put("/update-order-status/:id", updateOrderStatus);
router.delete("/delete-order/:id", deleteOrder);
router.get("/get-order/:id", getOrder);

export default router;