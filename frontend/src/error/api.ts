export class ApiError extends Error {
  statusCode?: number;
  endpoint?: string;

  constructor(message = "", statusCode?: number, endpoint?: string) {
    super(message);
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.name = 'ApiError';
  }
}
