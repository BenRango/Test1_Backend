import { PORT } from "@config/env.js";
import app from "./app.js";
import { AppDataSource } from "@config/data-source.js";
import { Server } from 'http'

let server: Server

AppDataSource.initialize().then(async () => {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.error(err));

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        AppDataSource.destroy(); 
    });
});