const { constants } = require("./constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : constants.SERVER_ERROR;
    next(err);

    // Informational (1xx) Status Codes
    if (statusCode >= 100 && statusCode < 200) {

    }

    // Successful (2xx) Status Codes
    else if (statusCode >= 200 && statusCode < 300) {

    }

    // Redirection (3xx) Status Codes
    else if (statusCode >= 300 && statusCode < 400) {

    }

    // Client Error (4xx) Status Codes
    else if (statusCode >= 400 && statusCode < 500) {
        switch (statusCode) {
            case constants.VALIDATION_ERROR:
                res.json({
                    title: "Validation failed",
                    message: err.message,
                    stackTrace: err.stack
                });
                break;
            case constants.NOT_FOUND:
                res.json({
                    title: "Not found",
                    message: err.message,
                    stackTrace: err.stack
                });
                break;
            case constants.UNAUTHORIZED:
                res.json({
                    title: "Unauthorized",
                    message: err.message,
                    stackTrace: err.stack
                });
                break;
            case constants.FORBIDDEN:
                res.json({
                    title: "Forbidden",
                    message: err.message,
                    stackTrace: err.stack
                });
                break;
            default:                    
                // all is good...
                console.log("All is good")
        }
    }

    // Server Error (5xx) Status Codes
    else if (statusCode >= 500 && statusCode < 600) {
        switch (statusCode) {
            case constants.SERVER_ERROR:
                res.json({
                    title: "Server error",
                    message: err.message,
                    stackTrace: err.stack
                });
                break;
            default:
                // all is good...
                console.log("All is good")
        }
    } else {
        console.log("No error, All is good");
    }
};

module.exports = errorHandler;
