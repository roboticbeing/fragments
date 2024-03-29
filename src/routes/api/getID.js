// src/routes/api/get.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */

// TODO: Add code in the future to convert based on file extension
 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = await fragment.getData();
        const successResponse = data;
        res.setHeader('content-type', fragment.type);
        res.status(200).send(
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