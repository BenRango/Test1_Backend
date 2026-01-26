import { health } from "@controllers/Health.Controller.js";
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transactionsRoutes from "./transactions.routes.js"
import { Router } from "express";

const router : Router = Router();

router.use('/auth', authRoutes);
router.get('/health', health)
router.use('/transactions', transactionsRoutes);
router.use('/users', userRoutes);

export default router;