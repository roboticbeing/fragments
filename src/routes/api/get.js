// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
 module.exports = async (req, res) => {
    const fragment = await Fragment.byUser(req.user, req.query.expand);
    const data = { fragments: fragment}
    const successResponse = createSuccessResponse(data);
    res.status(200).json(
      successResponse
    );
  };