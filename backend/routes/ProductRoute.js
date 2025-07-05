import { Router } from "express";
import {
  allCategory,
  allProducts,
  createProduct,
  deleteProduct,
  getProductById,
  productByCategory,
  shopAllProducts,
  updateProduct,
} from "../controllers/ProductController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

router.post("/create", verifyToken, upload.array("images", 10), createProduct);
router.get("/product", productByCategory);
router.get("/products", allProducts);
router.get("/categories", allCategory);
router.get("/", verifyToken, shopAllProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
