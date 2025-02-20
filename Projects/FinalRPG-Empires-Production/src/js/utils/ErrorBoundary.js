export class ErrorBoundary {
  static handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // You could add error reporting service here
  }

  static async wrap(promise, context) {
    try {
      return await promise;
    } catch (error) {
      this.handleError(error, context);
      throw error;
    }
  }
}
