export default class errorApi extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
  static badRequest(message: string) {
    return new errorApi(400, message);
  }
  static unauthorized(message: string) {
    return new errorApi(401, message);
  }
  static notFound(message: string) {
    return new errorApi(404, message);
  }
}
