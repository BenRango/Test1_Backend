import { validate } from "class-validator";
import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { Currencies, Transaction, TransactionTypes } from "@models/Transaction.js";
import { UserRepository } from "./Auth.Controller.js";
import e from "express";
import { HTTPError } from "../utils/httpError.ts";

const queryRunner = AppDataSource.createQueryRunner();


const TransactionRepository = AppDataSource.getRepository(Transaction)
export class TransactionController {
    /**
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>}
     * 
     * @description Create a new transaction (deposit or withdrawal)
     */
    static create = async (req: Request, res: Response) : Promise<void> => {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { amount, type, currency } = req.body as { amount: number; type: string; currency: Currencies  };
            const transaction = new Transaction();
            
            if (type !== TransactionTypes.DEPOSIT && type !== TransactionTypes.WITHDRAWAL) {
                res.status(400).json({ message: "Invalid transaction type", constraints: { type: "The type must be 'deposit' or 'withdrawal'" } });
                return;
            }
            if (type === TransactionTypes.DEPOSIT) {
                req.user!.creditBalance(amount, currency);
            } else if (type === TransactionTypes.WITHDRAWAL) {
                req.user!.debitBalance(amount, currency);
            }
            Object.assign(transaction, { amount, type, currency }); 
            transaction.user = req.user!;          
            const errors = await validate(transaction);
            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.constraints) });
                return;
            }
            await queryRunner.manager.save(req.user!)
            await queryRunner.manager.save(transaction)
            await queryRunner.commitTransaction();
            res.status(201).json({ message: "Transaction created successfully", transaction });
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.error(error);
            if(error instanceof HTTPError){
                res.status(error.status? error.status : 500).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        } finally{
            //await queryRunner.release();
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>}
     * 
     * @description Create a new transfer transaction
     */
    static transfer = async (req: Request, res: Response) : Promise<void> => {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await UserRepository.findOne({where: {id: req.user?.id}})
            const reciever_id = req.params.id!
            const { amount, currency } = req.body as { amount: number; currency: Currencies };
            const transaction = new Transaction();
            transaction.type = TransactionTypes.TRANSFER;
            const receiver = await UserRepository.findOneBy({id : reciever_id})
            if (!receiver) {
                res.status(404).json({ message: "Receiver not found" });
                return 
            }
            user?.debitBalance(amount, currency)
            receiver.creditBalance(amount, currency)
            
            
            Object.assign(transaction, { currency , amount});
            transaction.sender = user!;
            transaction.receiver = receiver;
            await queryRunner.manager.save(user!);
            await queryRunner.manager.save(receiver);

            transaction.user = user!;          
            const errors = await validate(transaction);
            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.constraints) });
                return;
            }
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();

            res.status(201).json({ message: "Deposit transaction created successfully", transaction });
        } catch (error) {
            await queryRunner.rollbackTransaction()
            if(error instanceof HTTPError){
                res.status(error.status? error.status : 500).json({ message: error.message });
                return;
            }
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
        finally{
            //await queryRunner.release();
        }
    }

    /**
     * @description Retrieves all transactions from the database.
     * @param req 
     * @param res 
     */
    static getAll = async (req: Request, res: Response) => {
        try {
            const transactions = await TransactionRepository.find();
            res.status(200).json({ transactions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @description Retrieves transactions associated with the authenticated user.
     * @param req 
     * @param res 
     */
    static trasactionsByUserConnected = async (req: Request, res: Response) => {
        try {
            const user = req.user!;
            const transactions = await TransactionRepository.find({
                where: { user: { id: user.id } },
                relations: ["transactions"]
            });
            res.status(200).json({ transactions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    /**
     * @description Retrieves transactions associated with a specific user by its ID.
     * @param req 
     * @param res 
     * @returns 
     */
    static trasactionsByUser = async (req: Request, res: Response) => {
        try {
            const user = await UserRepository.findOneBy({id : req.params.user_id!});
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const transactions = await TransactionRepository.find({
                where: { user: { id: user.id } },
            });
            res.status(200).json({ transactions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * @description Retrieves the details of a specific transaction by its ID.
     * @param req 
     * @param res 
     * @returns 
     */
    static details = async (req: Request, res: Response) => {
        try {
            const transactionId = req.params.id;
            const transaction = await TransactionRepository.findOneBy({ id: transactionId! });
            if (!transaction) {
                res.status(404).json({ message: "Transaction not found" });
                return;
            }
            res.status(200).json({ transaction });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}