const fs = require('fs');
const path = require('path');

const TEST_FILE = path.join(__dirname, 'todos-test.json');

// 每次运行前清理测试残留，保证测试隔离
if (fs.existsSync(TEST_FILE)) {
  fs.unlinkSync(TEST_FILE);
}
process.env.TODOS_FILE = TEST_FILE;

const request = require('supertest');
const app = require('../server');

describe('/api/todos 接口单元测试', () => {
  test('正常场景：POST 创建 Todo，GET 列表包含该 Todo', async () => {
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: '单元测试任务' });
    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeDefined();
    expect(createRes.body.title).toBe('单元测试任务');

    const listRes = await request(app).get('/api/todos');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: '单元测试任务' })
      ])
    );
  });

  test('异常场景：POST 空 body 应返回 400', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.status).toBe(400);
  });

  test('边界场景：DELETE 不存在的 ID 应返回 404', async () => {
    const res = await request(app).delete('/api/todos/999999');
    expect(res.status).toBe(404);
  });
});