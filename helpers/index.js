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

// class HttpError {
//     constructor(message,status) {
//         this.message = message;
//         this.name = "HttpError";
//         this.status = status;
//     }
// }

module.exports = {
    tryCatchWrapper,
    HttpError,
};