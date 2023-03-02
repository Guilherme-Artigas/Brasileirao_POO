export default class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
    this.stack = '400';
  }
}
