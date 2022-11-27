// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Our authorization middleware
const { authenticate } = require('../authorization');

const { createSuccessResponse } = require('../response');

// Create a router that we can use to mount our API
const router = express.Router();

// get the server's host name
const { hostname } = require('os');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(),  require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  const data = {author: author, githubUrl: 'https://github.com/roboticbeing/fragments', version: version, hostname: hostname()}
  const successResponse = createSuccessResponse(data);
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json(
    successResponse
  );
});

module.exports = router;