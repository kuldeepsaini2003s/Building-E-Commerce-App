import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  shopAllEvents,
  updateEvent,
} from "../controllers/EventController.js";

const router = Router();
router.use(verifyToken);

router.post("/create", upload.array("images", 6), createEvent);
router.get("/events", getAllEvents);
router.get("/", shopAllEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
