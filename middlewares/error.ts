
import { NextFunction, Response, Request } from "express";



export const errorHandling = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.status === 502) {
        res.status(502).send('Custom 502: Bad Gateway Error');
    } else {
        next(err);
    }
}