import { Router } from "express";
import {
  activeUser,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  register,
  resetPassword,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/verifyUser", activeUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/login", loginUser);

router.get("/logout", verifyToken, logoutUser);
router.get("/refreshToken", refreshAccessToken);
router.get("/", verifyToken, getUser);

export default router;
