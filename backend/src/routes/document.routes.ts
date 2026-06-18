import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";
import { DocumentController } from "../controllers/document.controller.js";

const router = Router();

const controller = new DocumentController();

router.get("/", authenticate, controller.getAll);
router.delete("/:id", authenticate, controller.deleteDocument);
router.post("/upload", authenticate, upload.single("file"), controller.upload);

export default router;
