import express from "express";

import  {getExecutionHistory } from "../controllers/executeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/code/:codeId",
    protect,
    getExecutionHistory
);

export default router;