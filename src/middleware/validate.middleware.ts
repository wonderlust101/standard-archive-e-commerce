import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

type Schema = {
    body?: ZodObject;
    params?: ZodObject;
    query?: ZodObject;
}

export const validate = (schema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (schema.body)
            req.body = await schema.body.parseAsync(req.body);
        if (schema.params)
            req.params = await schema.params.parseAsync(req.params) as any;
        if (schema.query)
            req.query = await schema.query.parseAsync(req.query) as any;

        next();
    };
};
