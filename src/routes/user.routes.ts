import { isAdmin } from "@/middlewares/isAdmin.js";
import { UserController } from "@controllers/User.Controller.js";
import { Router } from "express";

const router = Router()
router.get("/me", UserController.getProfile);
router.get("/", isAdmin, UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.updateUser);

export default router;