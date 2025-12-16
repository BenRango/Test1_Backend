import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import * as path from "path"
import { dirname } from 'path';
import { Transaction } from '../models/Transaction.js'; // Ajustez le chemin si nécessaire
import { User } from '../models/User.js';
import { DATABASE_URL, LOCAL_DATABASE_URL, runningInDocker } from "./env.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelsPath = path.join(__dirname, '..', 'models/*.{ts,js}');
const migrationsPath = path.join(__dirname, '..', 'migrations/*.{ts,js}');


if (!DATABASE_URL) {
    throw new Error("DATABASE_URL est undefined. Veuillez vérifier votre fichier .env");
}


export const AppDataSource = new DataSource({
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