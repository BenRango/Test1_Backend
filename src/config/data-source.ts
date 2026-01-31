import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { Transaction } from '../models/Transaction.js'; 
import { User } from '../models/User.js';
import { DATABASE_URL, LOCAL_DATABASE_URL, runningInDocker, testingMode } from "./env.js";
import { migrationsPath, modelsPath } from '@/utils/paths.js';




if ( !testingMode && !DATABASE_URL) {
    throw new Error("DATABASE_URL est undefined. Veuillez vérifier votre fichier .env");
}


export const AppDataSource = testingMode? 
    new DataSource({
        type: 'sqlite',
        database: './database.sqlite',
        synchronize: true,     
        logging: true,
        entities: [User, Transaction],
        migrations: [migrationsPath],
    })

    : new DataSource({
    type: 'postgres',
    url: runningInDocker? DATABASE_URL : LOCAL_DATABASE_URL,
    extra:{
        ssl:false
    },
    synchronize: true,
    logging: true,
    entities: [User, Transaction],
    subscribers: [],
    migrations: [
        migrationsPath
    ],
    migrationsTableName: "custom_migration_table",
});