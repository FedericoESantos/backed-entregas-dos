export class CustomError {
    constructor(name, message, statusCode) {
        this.message = message;
        this.name = name;
        this.statusCode = statusCode;
    }
}

export class ValidationError  {
    constructor(message) {
        message = 'ValidationError', message, 400;
    }
}

export class DatabaseError {
    constructor(message) {
        message = 'DatabaseError', message, 500;
    }
}

export class NotFoundError {
    constructor(message) {
        message ='NotFoundError', message, 404;
    }
}


