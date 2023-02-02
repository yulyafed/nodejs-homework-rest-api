function tryCatchWrapper(enpointFn) {
    return async (req, res, next) => {
        try {
            await enpointFn(req, res, next);
        } catch (error) {
            return next(error);
        }
    };
}

class Error {
    constructor(status, message) {
        this.status = status;
        this.message = message;
        this.name = "Error";         
  }
}

class HttpError extends Error {
    constructor(status,message) {
        super(status,message);
        this.name = "HttpError";
        this.status = status;
    }
}

async function sendMail({ to, html, subject }) {
    const email = {
        from: "YulyaFed86@gmail.com",
        to,
        subject,
        html,
    };

        await sendMail(email);
}

module.exports = {
    tryCatchWrapper,
    HttpError,
    sendMail,
};