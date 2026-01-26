import 'reflect-metadata'

import app from "../app.js"
import request from 'supertest'
import bcryptjs from "bcryptjs";
import { User } from '../models/User.js';
import { AppDataSource } from '../config/data-source.js'


describe('Tests de l\'api Backend', () => {

    beforeEach(async () => {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete({name: "blue"}); 
    });
    test('POST /api/v1/auth/login devrait retourner un JWT', async () => {
        const userRepository = AppDataSource.getRepository(User);
        const passwordHash = await bcryptjs.hash('password123', 10);
        await userRepository.save({ name: "blue", phone :"0707072980", email: 'test@example.com', password: passwordHash });
        const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email : "test@example.com", password: "password123" });

        expect(response.statusCode).toBe(200);
    });

});