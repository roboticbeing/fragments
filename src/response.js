// src/response.js

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
     "fragment": {
        "id": "30a84843-0cd4-4975-95ba-b96112aea189",
        "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
        "created": "2021-11-02T15:09:50.403Z",
        "updated": "2021-11-02T15:09:50.403Z",
        "type": "text/plain",
        "size": 256
 *  }
 */
 module.exports.createSuccessResponse = function (data) {
    return {
      status: 'ok',
      ...data
    };
  };
  
  /**
   * An error response looks like:
   *
   * {
   *   "status": "error",
   *   "error": {
   *     "code": 400,
   *     "message": "invalid request, missing ...",
   *   }
   * }
   */
  module.exports.createErrorResponse = function (code, message) {
    return {
        status: 'error',
        error: {
            code: code,
            message: message
        }
    };
};