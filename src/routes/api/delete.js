// src/routes/api/get.js

const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Allows the authenticated user to delete one of their existing fragments with the given id.
 */

 module.exports = async (req, res) => {
    try {
        await Fragment.delete(req.user, req.params.id);
        res.status(200).send(
            createSuccessResponse()
        );
    }
    catch(err) {
        const errorResponse = createErrorResponse(404, err);
        res.status(errorResponse.error.code).json({
            errorResponse
      });
    }
  };