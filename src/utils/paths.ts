import * as path from "path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(filename);


const modelsPath = path.join(__dirname, '..', 'models/*.{ts,js}');

const migrationsPath = path.join(_dirname, '..', 'migrations/*.{ts,js}');

export {modelsPath, migrationsPath}