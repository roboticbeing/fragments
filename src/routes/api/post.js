// src/routes/api/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
 module.exports = (req, res) => {
    try {
        const data = req.body;
        const fragment = new Fragment({ ownerId: req.user, type: req.get('content-type')});
        fragment.save();
        fragment.setData(data);
        res.setHeader('Location', process.env.API_URL + '/v1' + req.url)
        const successResponse = createSuccessResponse(fragment);
        res.status(201).json(
        successResponse
        );
    }
    catch (err) {
        const errorResponse = createErrorResponse(415, 'unsupported content-type');
        res.status(errorResponse.error.code).json({
            errorResponse
          });
        }
  };