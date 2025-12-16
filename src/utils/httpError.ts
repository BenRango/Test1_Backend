/**
 * Custom HTTP Error class to represent HTTP errors with status codes.
 */
export class HTTPError extends Error {
    status?: number;
    message: string;
    constructor(message: string, status?: number) {
        super(message);
        this.message = message;
        if (status) {
            this.status = status;
        }
    }
}