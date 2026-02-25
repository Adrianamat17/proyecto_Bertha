const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Game = require('../src/models/Game');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Game.deleteMany({});
});

describe('Game API', () => {
  it('should create a new game and prevent duplicates', async () => {
    const payload = { titulo: 'Test Game', descripcion: 'testing', horasJugadas: 10 };
    const res1 = await request(app).post('/api/v1/games/post').send(payload);
    expect(res1.status).toBe(201);
    expect(res1.body.titulo).toBe('Test Game');

    const res2 = await request(app).post('/api/v1/games/post').send(payload);
    expect(res2.status).toBe(400);
    expect(res2.body.mensaje).toMatch(/Ya existe/i);
  });

  it('should list games with pagination', async () => {
    for (let i = 0; i < 5; i++) {
      await Game.create({ titulo: `G${i}`, descripcion: 'x' });
    }
    const res = await request(app).get('/api/v1/games/get/all?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.datos.length).toBe(2);
    expect(res.body.total).toBe(5);
  });

  it('should not delete a completed game', async () => {
    const game = await Game.create({ titulo: 'Done', descripcion: 'd', completado: true });
    const res = await request(app).delete(`/api/v1/games/delete/${game._id}`);
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/No se puede eliminar/i);
  });
});
