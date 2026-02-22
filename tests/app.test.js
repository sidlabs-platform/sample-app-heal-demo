const request = require('supertest');
const { app, resetTasks } = require('../src/app');

beforeEach(() => {
  resetTasks();
});

describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /tasks', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test task');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBe(1);
  });

  it('should reject empty title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should reject missing title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /tasks', () => {
  it('should return empty array initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return created tasks', async () => {
    await request(app).post('/tasks').send({ title: 'Task 1' });
    await request(app).post('/tasks').send({ title: 'Task 2' });
    const res = await request(app).get('/tasks');
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /tasks/:id', () => {
  it('should return a task by id', async () => {
    await request(app).post('/tasks').send({ title: 'Find me' });
    const res = await request(app).get('/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Find me');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('should delete a task', async () => {
    await request(app).post('/tasks').send({ title: 'Delete me' });
    const res = await request(app).delete('/tasks/1');
    expect(res.statusCode).toBe(204);

    const listRes = await request(app).get('/tasks');
    expect(listRes.body).toHaveLength(0);
  });

  it('should return 404 when deleting non-existent task', async () => {
    const res = await request(app).delete('/tasks/999');
    expect(res.statusCode).toBe(404);
  });
});
