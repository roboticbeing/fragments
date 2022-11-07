// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with an empty fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments).toEqual([]);
  });

  // test user with 1 fragment and expect an array with 1 fragment id
  test("a fragment is added to the list of a user's fragments", async () => {
    const data = Buffer.from('hello');
    const expected = [expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)];
    await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send(data);
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');  
    expect(res.body.fragments).toEqual(expect.arrayContaining(expected));
  });

  // test expanded = true and expect the metadata details
  test("expanded = 1", async () => {
    const o = {
                id: expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/),
                ownerId: '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a',
                created: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                updated: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                type: 'text/plain',
                size: 5
              };
    const res = await request(app).get('/v1/fragments?expand=1').auth('user1@email.com', 'password1');  
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('fragments', [o]);
    expect(res.statusCode).toBe(200);

    // expect(res.body.fragments).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining(o)
    //   ])
    // );
  });
});