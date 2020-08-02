class AppError extends Error {

    constructor(message,statusCode, isOperational) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "Failed" : "Sucess"
        this.isOperational = true;
    }

}
module.exports = AppError;