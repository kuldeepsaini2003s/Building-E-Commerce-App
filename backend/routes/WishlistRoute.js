import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyToken);

export default router;
