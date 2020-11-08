import { NextFunction, Request, Response } from 'express'

import * as jwt from '../../services/jwt'

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const [, token] = (req.headers['authorization'] || '').split('Bearer')

    if (typeof token !== 'string' || token.length === 0) {
        return res.status(401).send()
    }

    jwt.verifyAccess(token)
        .then(() => next())
        .catch((err) => {
            console.log(err)
            return res.status(403).send()
        })
}
