// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragment object
  test('authenticated users can create a plain text fragment', async () => {
    const data = "a";
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    expect(res.body.ownerId).toBe('user1@email.com');
    expect(Date.parse(res.body.created)).not.toBeNaN();
    expect(Date.parse(res.body.updated)).not.toBeNaN();
    expect(res.body.type).toBe('text/plain');
    expect(res.body.size).toBe(1);
  });

  // responses include a Location header with a URL to GET the fragment
  test('response should include a Location header with correct URL', async () => {
    const data = "a";
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send(data);
    expect(res.header).toHaveProperty('location');
    expect(res.headers['location']).toBe('localhost:8080/v1/fragments');
  });

  // trying to create a fragment with an unsupported type errors as expected
  test('unsupported content-type should throw an error', async () => {
    const data = "a";
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'audio/webm').send(data);
    expect(res.statusCode).toBe(415);
  });
});

