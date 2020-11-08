import { NextFunction, Request, Response } from 'express'

import * as jwt from '../../services/jwt'

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.cookies

    if (typeof access_token !== 'string' || access_token.length === 0) {
        return res.status(401).send()
    }

    jwt.verifyAccess(access_token)
        .then(() => next())
        .catch((err) => {
            console.log(err)
            return res.status(403).send()
        })
}
