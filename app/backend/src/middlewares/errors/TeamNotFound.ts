export default class TeamNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamNotFound';
    this.stack = '404';
  }
}
