import { createNamespace, getNamespace } from 'node-request-context';
import { Request, Response } from 'express';
import uuid = require('uuid');

const NAMESPACE = 'requestGlobal';

export class RequestContext {

    public readonly id: string;
    public module: string = 'default';
    public request: Request;
    public response: Response;

    constructor(request: Request, response: Response, id?: string) {
        this.id = id || uuid.v4();
        this.request = request;
        this.response = response;
    }

    public static setGeneralModule(name: string): void {
        getNamespace(NAMESPACE).get('tid').module = name;
    }

    public static getRequestId(): string | null {
        return (RequestContext.currentRequestContext() || {id: null}).id;
    }

    public static currentRequestContext(): RequestContext {
        const namespace = getNamespace(NAMESPACE);

        try {
            return namespace.get('tid');
        } catch {
            return null;
        }
    }

}
export function RequestContextMiddleware(req: Request, res: Response, next) {
    const rc = new RequestContext(req, res, (req.headers['request-id'] as string));
    const namespace = getNamespace(NAMESPACE) || createNamespace(NAMESPACE);
    namespace.run(() => {
        namespace.set('tid', rc);
        next();
    });
}
