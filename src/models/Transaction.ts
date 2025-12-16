import "reflect-metadata"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@models/User.js"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export const TransactionTypes = {
    TRANSFER : 'transfer',
    DEPOSIT : 'deposit',
    WITHDRAWAL : 'withdrawal'
} as const

export type TransactionTypes = typeof TransactionTypes[keyof typeof TransactionTypes]

export const Currencies = {
    USD : 'USD',
    EUR : 'EUR',
    XOF : 'XOF'
} as const

export type Currencies = typeof Currencies[keyof typeof Currencies]
/**
 * @interface UserInterface
 * @description Defines the structure of a User object.
 * 
 * @property {string}  id - Unique identifier for the transaction
 * @property {User}  user - The user associated with the transaction
 * @property {number}  amount - The amount involved in the transaction
 * @property {Date}  date - The date of the transaction
 */
interface TransactionInterface {
    id: string;
    sender?: User
    receiver?: User
    currency : Currencies
    user :User
    type : TransactionTypes
    amount: number;
    date ?: Date
}

/**
 * @class Transaction
 * @description Represents a financial transaction in the system.
 */
@Entity()
export class Transaction implements TransactionInterface {
    /** 
     * @member {string}  id 
     * @description Unique identifier for the transaction
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string

    /**
     * @member {number} amount 
     * @description The amount involved in the transaction
     */
    @Column("double precision")
    @IsNotEmpty({message : "The 'amount' field is required"})
    @IsNumber({}, {message : "The 'amount' field must be a number"})
    amount : number

    /**
     * @member {TransactionType} type 
     * @description The type of the transaction (e.g., transfer, deposit, withdrawal)
     */
    @IsEnum(TransactionTypes, {message : "The type must be 'transfer', 'deposit' or 'withdrawal'"})
    @Column("varchar", {length: 20})
    type !: TransactionTypes

    @Column("varchar", {length: 10, default: Currencies.XOF})
    @IsEnum(Currencies, {message : "The currency must be 'USD', 'EUR' or 'XOF'"})
    currency : Currencies

    /** 
     * @member {User} sender 
     * @description The initiator of the transaction if its a transfer
     */
    @ManyToOne(() => User, (user) => user.outgoing_transactions, {nullable: true, cascade: true})
    @JoinColumn({ name: 'senderId' })
    sender ?: User

    /** 
     * @member {User} receiver 
     * @description The target of the transaction if its a transfer
     */
    @ManyToOne(() => User, (user) => user.incoming_transactions, {nullable: true, cascade: true})
    @JoinColumn({ name: 'receiverId' })
    receiver ?: User

     /** 
     * @member {User} user 
     * @description The user associated with the transaction
     */
    @ManyToOne(() => User, (user) => user.transactions, {nullable: false, cascade: true})
    @JoinColumn({ name: 'userId' })
    user !: User

    @CreateDateColumn()
    date?: Date

    constructor () {
        this.amount = 0
        this.currency = Currencies.XOF
    }
}