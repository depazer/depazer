export class CACError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CACError'
  }
}
