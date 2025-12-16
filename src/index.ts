import "reflect-metadata";
import * as http from 'http';
import type {Application} from "express"
import express from "express"
import routes from '@routes/index.routes.js'
import { AppDataSource } from './config/data-source.js';
import { PORT } from "./config/env.mjs";
import cors from "cors" 

const app : Application = express()

const server = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/test', routes ); 
app.use('', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.status(404).send('Not Found');
});
AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!")
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
    );
}).catch((err) => {
    console.error("Error during Data Source initialization:", err)
});