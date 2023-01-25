function tryCatchWrapper(enpointFn) {
    return async (req, res, next) => {
        try {
            await enpointFn(req, res, next);
        } catch (error) {
            return next(error);
        }
    };
}

function HttpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// class Error {
//     constructor(message) {
//         this.message = message;
//         this.name = "Error";         
//   }
// }

// class HttpError extends Error {
//     constructor(message) {
//         super(message);
//         this.name = "HttpError";
//     }
// }

module.exports = {
    tryCatchWrapper,
    HttpError,
};