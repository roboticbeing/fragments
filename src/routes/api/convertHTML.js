const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
var md = require('markdown-it')();

// Convert to HTML
 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = await fragment.getData();
        const successResponse = md.render(data.toString());
        if(fragment.type !== 'text/markdown' && fragment.type !== 'text/html') throw "cannot convert";
        res.setHeader('content-type', 'text/html');
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