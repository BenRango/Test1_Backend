import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(dotenv.config({path: path.join(__dirname, '../../.env.local')}));
if (!process.env.LOCAL_DATABASE_URL && !process.env.DATABASE_URL) {
    dotenv.config()
}
export const runningInDocker = process.env.NODE_ENV === "production" ? true :false
export const {JWT_SECRET_KEY}= process.env as {JWT_SECRET_KEY: string};
export const {PORT} = (process.env as {PORT: string});

export const {HOST} = runningInDocker ? process.env as {HOST: string} : {HOST: "localhost:"+PORT};
export const {DATABASE_URL} = process.env as {DATABASE_URL: string};
export const {LOCAL_DATABASE_URL} = process.env as {LOCAL_DATABASE_URL: string};


