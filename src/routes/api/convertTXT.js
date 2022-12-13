const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

// Convert to TXT
 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = await fragment.getData();
        const successResponse = data;
        if(!fragment.isText) {
            if(fragment.type != "application/json") {
            throw "cannot convert";
            }
        }
        res.setHeader('content-type', 'text/plain');
        res.status(200).send(
            successResponse
        );
    }
    catch(err) {
        const errorResponse = createErrorResponse(415, 'unsupported type conversion');
        res.status(errorResponse.error.code).json({
            errorResponse
      });
    }
  };