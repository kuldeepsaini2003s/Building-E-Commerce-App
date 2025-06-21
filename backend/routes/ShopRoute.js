import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import {
  activeShop,
  createShop,
  forgotPassword,
  getShop,
  getShopInfo,
  logoutShop,
  resetPassword,
  updateShop,
} from "../controllers/ShopController.js";
import { loginShop } from "../controllers/ShopController.js";

const router = Router();

router.post("/createShop", upload.single("avatar"), createShop);
router.post("/verifyShop", activeShop);
router.post("/loginShop", loginShop);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

router.get("/", verifyToken, getShop);
router.get("/logoutShop", verifyToken, logoutShop);
router.put("/", verifyToken, upload.single("avatar"), updateShop);
router.get("/getShopSnfo", verifyToken, getShopInfo);

export default router;
