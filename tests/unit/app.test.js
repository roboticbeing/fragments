// tests/unit/app.test.js

// Write a test to cause a 404 to occur, using supertest

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

describe('Test app.js', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/not-found');
    expect(res.statusCode).toBe(404);
  });
});