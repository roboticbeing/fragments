// tests/unit/getID.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/cbcacf23-0d60-4e4b-8584-a7ffb8f936ed').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/cbcacf23-0d60-4e4b-8584-a7ffb8f936ed').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result
  test('authenticated users get fragment data', async () => {
    const data = "a";
    const post = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send(data);
    const res = await request(app).get('/v1/fragments/' + post.body.id).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(data);
  });

  test('unknown fragment IDs should have an error 404', async () => {
    const res = await request(app).get('/v1/fragments/fake-id').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});