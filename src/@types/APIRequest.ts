export type APIRequest<T = undefined> = {
    success: true;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}
export type APIErrorRequest = {
    success: false;
    message: string;
    statusCode: string;
    issues?: Record<string, string[]>;
}