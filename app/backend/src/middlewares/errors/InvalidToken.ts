export default class InvalidToken extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidToken';
    this.stack = '401';
  }
}
