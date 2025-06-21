import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createCouponCode,
  deleteCouponCode,
  getCouponCodeById,
  getShopCouponCodes,
  updateCouponCode,
} from "../controllers/CouponCodeController.js";

const router = Router();
router.use(verifyToken);

router.post("/create", createCouponCode);
router.get("/", getShopCouponCodes);
router.get("/:id", getCouponCodeById);
router.put("/:id", updateCouponCode);
router.delete("/:id", deleteCouponCode);

export default router;