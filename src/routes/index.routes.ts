import { Router } from "express";

const router : Router = Router();

router.use('/auth', await import('./auth.routes.js').then(m => m.default));
router.use('/transactions', await import('./transactions.routes.js').then(m => m.default));

export default router;