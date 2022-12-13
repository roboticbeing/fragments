// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = req.body;
        if (req.get('content-type') != fragment.type) {
            const errorResponse = createErrorResponse(400, 'content-type does not match');
            res.status(errorResponse.error.code).json({
                errorResponse
              });
              throw "content-type doesn't match";
        }
        fragment.setData(data);
        const response = {fragment: fragment};
        const successResponse = createSuccessResponse(response);
        res.status(201).json(
        successResponse
        );
    }
    catch (err) {
        const errorResponse = createErrorResponse(404, 'no such fragment exists with the given id');
        res.status(errorResponse.error.code).json({
            errorResponse
          });
        }
  };