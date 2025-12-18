import { UserController } from "@controllers/User.Controller.ts";
import { Router } from "express";

const router = Router()
router.get("/me", UserController.getProfile);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.updateUser);

export default router;