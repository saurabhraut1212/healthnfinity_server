import express from "express";
import { admin, protect } from "../middlewares/protect.js";
import { deleteLog, getLogs, getUserLogs, updateLog } from "../controllers/logController.js";

const router = express.Router();

router.get('/logs', protect, admin, getLogs);
router.get('/user/logs', protect, getUserLogs);
router.delete('/log/:id', protect, deleteLog);
router.put('/log/:id', protect, updateLog)

export default router;