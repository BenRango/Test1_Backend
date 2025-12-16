import { UserRoles, type User } from "@models/User.ts";
import type { Request, Response } from "express";

export async function isAdmin(req: Request, res: Response, next: Function) {
    if (!(req?.user as User).roles.includes(UserRoles.ROLE_ADMIN)) {
        res.status(403).json({ message: "Insufficient permissions to perform this action" });
        return;
    }
    next();
}