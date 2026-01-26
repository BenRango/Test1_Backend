import type { Request, Response } from "express";

export const health = async (req: Request, res: Response):Promise<void> =>{
    try {
        res.status(200).json({ status: 'UP' });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: (error as Error).message})
    }
}