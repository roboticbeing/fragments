// src/routes/api/get.js

const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Allows the authenticated user to get (i.e., read) the metadata for one of their existing fragments with the specified id. 
 * If no such fragment exists, returns an HTTP 404 with an appropriate error message.
 */

 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = { fragment: fragment};
        const successResponse = createSuccessResponse(data);
        res.status(200).json(
            successResponse
        );
    }
    catch(err) {
        const errorResponse = createErrorResponse(404, 'unknown fragment');
        res.status(errorResponse.error.code).json({
            errorResponse
      });
    }
  };