const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const sharp = require("sharp");

// Convert to img
 module.exports = async (req, res) => {
    try {
        const fragment = await Fragment.byId(req.user, req.params.id);
        const data = await fragment.getData();
        const img = await sharp(data).toFormat(req.params.ext).toBuffer();
        const successResponse = img;
        const type = fragment.type;
        if(!type.startsWith("image")) throw "cannot convert";
        res.setHeader('content-type', 'image/' + req.params.ext);
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