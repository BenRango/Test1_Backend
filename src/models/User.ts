import "reflect-metadata";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, Length,  IsNotEmpty } from "class-validator";
import type { JwtPayload } from "jsonwebtoken";
import { Currencies, Transaction } from "./Transaction.js";
import { HTTPError } from "../utils/httpError.ts";
export const UserRoles = {
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_USER: "ROLE_USER"
} as const;

export type UserRoles = typeof UserRoles[keyof typeof UserRoles]

/**
 * @interface UserInterface
 * @description Defines the structure of a User object.
 * @property {string}  id - Unique identifier for the user
 * @property {string}  name - The name of the user
 * @property {string}  email - The email address of the user
 * @property {string}  phone - The phone number of the user
 * @property {string}  [password] - The password for the user account
 * @property {Date}  createdAt - The date the user was created
 * @property {UserRoles[]}  [role] - The role of the user (e.g., admin, user)
 */
export interface UserInterface {
    id: string;
    name: string;
    email: string;
    phone: string;
    balance : number;
    password: string;
    roles : UserRoles[]
    createdAt: Date;
}

/**
 * @description Converts an amount from EUR to USD.
 * @param amount 
 * @returns {number} The converted amount in USD
 */
function EURtoUSD(amount: number): number {
    const exchangeRate = 1.18;
    return amount * exchangeRate;
}


/**
 * @description Converts an amount from XOF to USD.
 * @param amount 
 * @returns {number} The converted amount in USD
 */
function XOFtoUSD(amount: number): number {
    const exchangeRate = 0.0018;
    return amount * exchangeRate;
}

/**
 * @class User
 * @description Represents a user in the system.
 */
@Entity()
export class User implements UserInterface {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column("varchar", { length: 100 })
    @IsNotEmpty({message : "The 'name' field is requiered"})
    name!: string


    @Column("varchar", { length: 200, unique: true })
    @IsEmail()
    @IsNotEmpty({message : "The 'email' field is required"})
    email!: string

    @Column("varchar", { length: 15, unique: true, nullable: false })
    @IsNotEmpty({message : "The 'phone' field is required"})
    phone!: string

    @Column("text", {nullable: false, select: false})
    @Length(6, 100, {message : "The password must contain at least 6 characters"})
    @IsNotEmpty({message : "The 'password' field is required"})
    password!: string

    @Column("simple-array", { default: UserRoles.ROLE_USER })
    roles: UserRoles[]

    @Column("double precision", { default: 0 })
    balance : number

    @CreateDateColumn()
    createdAt!: Date


    /**
     * 
     * @returns {JwtPayload} The payload for JWT token without the password
     */
    toPayload() : JwtPayload{
        const payload : JwtPayload = {}
        Object.assign(payload, this)
        delete (payload ).password
        return payload
    }

    /**
     * @description Credits the user's balance based on the provided currency.
     * @param amount 
     * @param currency 
     */
    creditBalance(amount : number, currency: Currencies) {
        switch (currency) {
            case Currencies.USD:
                this.balance += amount;
                break;
            case Currencies.EUR:
                this.balance += EURtoUSD(amount);
                break;
            case Currencies.XOF:
                this.balance += XOFtoUSD(amount);
                break;
            default:
                break;
        }
    }

    /**
     * @description Debits the user's balance based on the provided currency.
     * @param amount 
     * @param currency 
     */
    debitBalance(amount : number, currency: Currencies) {
        
        switch (currency) {
            case Currencies.USD:
                break;
            case Currencies.EUR:
                amount = EURtoUSD(amount);
                break;
            case Currencies.XOF:
                amount = XOFtoUSD(amount);
                break;
            default:
                break;
        }
        if (amount > this.balance) {
            const error = new HTTPError(`The withdrawal amount (${amount} $) exceeds the available balance (${this.balance.toFixed(2)} $)`, 422);
            throw error;
        }
        this.balance -= amount;

    }

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions !: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.sender)
    outgoing_transactions !: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.receiver)
    incoming_transactions !: Transaction[]

    constructor(){
        this.balance = 0
        this.roles = [UserRoles.ROLE_USER]
        
    }
}
