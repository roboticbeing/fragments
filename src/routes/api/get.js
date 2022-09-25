// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
 module.exports = (req, res) => {
    const data = { fragments: []}
    const successResponse = createSuccessResponse(data);
    res.status(200).json(
      successResponse
    );
  };