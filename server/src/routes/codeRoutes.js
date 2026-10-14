import express from "express";

import {
    createCode,
    getCodes,
    getCodeById,
    updateCode,
    deleteCode
} from "../controllers/codeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createCode).get(protect, getCodes);

router.route("/:id").get(protect, getCodeById).put(protect, updateCode).delete(protect, deleteCode);

export default router;