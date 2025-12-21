import { User } from "@models/User.js";
import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@config/data-source.js";
import { JWT_SECRET_KEY } from "@config/env.mjs";
import { validate } from "class-validator";

export const UserRepository = AppDataSource.getRepository(User)
export class AuthController {
    /**
     * @description Register a new user
     * @param req 
     * @param res 
     * @returns 
     */
    static register =  async (req: Request, res: Response) => {
        try {
            const existingUser = await UserRepository.findOneBy({ email: req.body.email });
            if (existingUser) {
                res.status(400).json({ message: "Email already in use" });
                return;
            }
            const {password, confirmPassword} = req.body;
            if (!password || !confirmPassword) {
                res.status(400).json({ message: " 'password' and 'confirmPassword' fields are required" });
                return 
            }
            if(password !== confirmPassword){
                return  res.status(400).json({ message: "Password and confirm password do not match" });
            }
            const hashedPassword =  await bcryptjs.hash( password, 10);
            req.body.password = hashedPassword;
            const user = new User()
            Object.assign(user, req.body)
            const errors = await validate(user);
            if (errors.length > 0) {
                res.status(400).json({errors : errors.map(error =>{return error.constraints})})
                return;
            }
            const acces_token = jwt.sign( user.toPayload() , JWT_SECRET_KEY as string, { expiresIn: '1h' } );
            await UserRepository.save(user);
            res.status(201).json({ message: "User registered successfully", acces_token, user: user.toPayload() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error", message: (error as Error).message });
        }
    }

    /**
     * @description Login a user
     * @param req 
     * @param res 
     * @returns 
     */
    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as {email: string, password: string };
            const user = await UserRepository.findOne({ where:  { email }, select:  { password : true } });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const authanticated = await bcryptjs.compare(password, user.password);
            if (!authanticated) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const acces_token = jwt.sign( user.toPayload() , JWT_SECRET_KEY as string, { expiresIn: '1h' } );
            res.status(200).json({ message: "Login successful", acces_token }); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error", message: (error as Error).message });
        }
    }
}