import type { Request, Response } from "express";
import { UserRepository } from "./Auth.Controller.js";

export class UserController {
    /**
     * @description Get the profile of the currently authenticated user
     * @param req 
     * @param res 
     */
    static getProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user!;
            res.status(200).json({ user: user?.toPayload() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @description Retrieves all users from the database.
     * @param req 
     * @param res 
     */
    static getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await UserRepository.find({select: {password : false}});
            res.status(200).json({ users });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @description Retrieves a user by its ID.
     * @param req 
     * @param res 
     * @returns 
     */
    static getUserById = async (req: Request, res: Response) => {
        try {
            const user = await UserRepository.findOne({where: {id : req.params.id!}, select: {password : false}});
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @description Deletes a user by its ID.
     * @param req 
     * @param res 
     * @returns 
     */
    static deleteUser = async (req: Request, res: Response) => {
        try {
            const user = await UserRepository.findOneBy({id : req.params.id!});
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            await UserRepository.remove(user);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    /**
     * @description Updates a user's information by its ID.
     * @param req 
     * @param res 
     * @returns 
     */
    static updateUser = async (req: Request, res: Response) => {
        try {
            const { name, email, phone } = req.body;
            const user = await UserRepository.findOneBy({id : req.params.id!});
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            Object.assign(user, { name, email, phone });
            await UserRepository.save(user);
            res.status(200).json({ message: "User updated successfully", user: user.toPayload() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}