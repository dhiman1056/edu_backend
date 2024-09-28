// // customError.js
// class HandleCustomError extends Error {
//     constructor(message, status) {
//         super(message);
//         this.status = status;
//     }
// }

class HandleCustomError extends Error {
    constructor(message, statusCode) {
      super(typeof message === 'object' ? JSON.stringify(message) : message);
      this.statusCode = statusCode;
      this.isCustom = true; // You can use this to identify your custom errors
    }

    toJSON() {
      if (this.isCustom && typeof this.message === 'string') {
        try {
          return JSON.parse(this.message);
        } catch (e) {
          // If parsing fails, return the message as is
          return { message: this.message };
        }
      }
      return { message: this.message };
    }
  }

export default HandleCustomError;
