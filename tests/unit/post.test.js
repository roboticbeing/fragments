// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragment object, text/plain
  test('authenticated users can create a plain text fragment', async () => {
    const data = "a";
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    expect(res.body.ownerId).toBe('11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a');
    expect(Date.parse(res.body.created)).not.toBeNaN();
    expect(Date.parse(res.body.updated)).not.toBeNaN();
    expect(res.body.type).toBe('text/plain');
    expect(res.body.size).toBe(1);
  });

  // text/markdown
  test('authenticated users can create a text/markdown fragment', async () => {
    const data = Buffer.from('# hello');
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/markdown').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    expect(res.body.ownerId).toBe('11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a');
    expect(Date.parse(res.body.created)).not.toBeNaN();
    expect(Date.parse(res.body.updated)).not.toBeNaN();
    expect(res.body.type).toBe('text/markdown');
    expect(res.body.size).toBe(7);
  });

  // text/html
  test('authenticated users can create a text/html fragment', async () => {
    const data = Buffer.from('<h1> hello </h1>');
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/html').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    expect(res.body.ownerId).toBe('11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a');
    expect(Date.parse(res.body.created)).not.toBeNaN();
    expect(Date.parse(res.body.updated)).not.toBeNaN();
    expect(res.body.type).toBe('text/html');
    expect(res.body.size).toBe(16);
  });

  // application/json
  test('authenticated users can create an application/json fragment', async () => {
    const data = {a: 1, b: 2}
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'application/json').send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.id).toMatch(
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      );
    expect(res.body.ownerId).toBe('11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a');
    expect(Date.parse(res.body.created)).not.toBeNaN();
    expect(Date.parse(res.body.updated)).not.toBeNaN();
    expect(res.body.type).toBe('application/json');
    expect(res.body.size).toBe(13);
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

