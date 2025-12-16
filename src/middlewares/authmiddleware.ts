import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@models/User.js";
import { AppDataSource } from "../config/data-source.js";
import { JWT_SECRET_KEY } from "@config/env.mjs";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("no token provided")
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY!) as { id: string };
    console.log("authMiddleware: Token décodé avec succès, ID:", decoded.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({where: { id: decoded.id}, select: {password : false} });

    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      next();
      return;
    }

    req.user = user;
    console.log({user})
    console.log("authMiddleware: req.user défini avec succès pour l'utilisateur:", user.email);
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: "Le token a expiré" });
      return;
    } else if (error.name === 'JsonWebTokenError') {
      console.log('tokenBack : ', token)

      res.status(401).json({ message: "Le token est invalide" });
      return;
    } else {
      console.error("Erreur lors de la vérification du token :", error);
      res.status(401).json({ message: "Erreur d'authentification" });
      return;
    }
  }
}
