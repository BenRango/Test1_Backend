import "reflect-metadata";
import * as http from 'http';
import type {Application} from "express"
import express from "express"
import routes from '@routes/index.routes.js'
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


app.use('/api/v1', routes ); 
app.use('', (req, res) => {
    console.log(`${req.method} ${req.url}`);
    res.status(404).send('Not Found');
});

export default app
