class DefaultError extends Error {
  constructor() {
    super();
    this.statusCode = 500;
    this.message = 'Ошибка по умолчанию';
  }
}

module.exports = DefaultError;
