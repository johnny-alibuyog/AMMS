abstract class HTTPClientError extends Error {
  readonly statusCode!: number;
  readonly name!: string;

  constructor(message: object | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message));
    }
    else {
      super(message);
    }
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class HTTP400Error extends HTTPClientError {
  readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

class HTTP401Error extends HTTPClientError {
  readonly statusCode = 401;

  constructor(message: string | object = "Unauthorized") {
    super(message);
  }
}

class HTTP403Error extends HTTPClientError {
  readonly statusCode = 403;

  constructor(message: string | object = "Forbidden") {
    super(message);
  }
}

class HTTP404Error extends HTTPClientError {
  readonly statusCode = 404;

  constructor(message: string | object = "Not found") {
    super(message);
  }
}


class HTTP422Error extends HTTPClientError {
  readonly statusCode = 422;
  readonly errors: string[];

  constructor(message: string | object = "Unprocessable Entity", ...errors: string[]) {
    super(message);
    this.errors = errors;
  }
}

export {
  HTTPClientError,
  HTTP400Error,
  HTTP401Error,
  HTTP403Error,
  HTTP404Error,
  HTTP422Error
}
