class AppErrors extends Error
{
    constructor(message,statusCode)
    {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
};

module.exports = AppErrors;

