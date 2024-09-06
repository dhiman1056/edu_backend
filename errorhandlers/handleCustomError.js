// customError.js
class HandleCustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export default HandleCustomError;
