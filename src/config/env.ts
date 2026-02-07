import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(filename);

try {
    console.log(dotenv.config({path: path.join(_dirname, '..','..', '.env.local' )}));
} catch (error) {
    console.log(dotenv.config({path: path.join(_dirname, '..','..', '.env' )}));
}
if (!process.env.LOCAL_DATABASE_URL && !process.env.DATABASE_URL) {
    dotenv.config()
}
export const runningInDocker = process.env.NODE_ENV === "production" ? true :false
export const testingMode = process.env.NODE_ENV === "test" ? true : false

export const { TEST_DATABASE_URL } = process.env as {TEST_DATABASE_URL: string};
export const JWT_SECRET_KEY= process.env.JWT_SECRET_KEY 
export const {PORT} = (process.env as {PORT: string});

//export const {HOST} = runningInDocker ? process.env as {HOST: string} : {HOST: "localhost:"+PORT};
export const {DATABASE_URL} = process.env as {DATABASE_URL: string};
export const {LOCAL_DATABASE_URL} = process.env as {LOCAL_DATABASE_URL: string};


