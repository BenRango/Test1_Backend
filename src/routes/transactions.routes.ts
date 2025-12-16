import { TransactionController } from "@controllers/Transaction.Controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router : Router = Router();

router.post("/", authMiddleware, TransactionController.create);
router.get("/", authMiddleware, TransactionController.getAll);

router.post("/transfer/:id", authMiddleware, TransactionController.transfer);
router.get("/user/me", authMiddleware, TransactionController.trasactionsByUserConnected);
router.get("/user/:user_id", authMiddleware, TransactionController.trasactionsByUser);
router.get("/:id", authMiddleware, TransactionController.details);

export default router;

