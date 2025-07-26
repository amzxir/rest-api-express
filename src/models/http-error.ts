class HttpError extends Error {
  readonly code?: number ;

  constructor(message: string, errorCode?: number) {
    super(message);
    this.code = errorCode;
  }
}

export default HttpError;
