export default class TokenNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenNotFound';
    this.stack = '401';
  }
}
