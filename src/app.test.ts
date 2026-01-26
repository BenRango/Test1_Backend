import request from 'supertest'
import app from "./app.js"

describe('Tests de l\'api Backend', () => {

  
  test('GET /moneytransfer/api/v1/health devrait retourner 200 OK', async () => {
    const response = await request(app).get('/moneytransfer/api/v1/health');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
  });

  
  /*test('POST /test/echo devrait retourner le message envoyé', async () => {
    const response = await request(app)
      .post('/test/echo')
      .send({ message: 'Hello DevOps' });

    expect(response.statusCode).toBe(201);
    expect(response.body.received).toBe('Hello DevOps');
  });

  
  test('POST /test/echo devrait retourner 400 si le body est vide', async () => {
    const response = await request(app).post('/test/echo').send({});
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing message');
    
  });*/

});