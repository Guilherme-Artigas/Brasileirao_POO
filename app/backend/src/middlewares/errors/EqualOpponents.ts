export default class EqualOpponents extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EqualOpponentsError';
    this.stack = '422';
  }
}
