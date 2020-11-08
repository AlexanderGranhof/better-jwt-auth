import jwt from 'jsonwebtoken'
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/env'

export const createAccess = (payload: Record<string, unknown>) => {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, ACCESS_SECRET, (err, token) => {
            return err ? reject(err) : resolve(token)
        }),
    )
}

export const createRefresh = (payload: Record<string, unknown>) => {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, REFRESH_SECRET, (err, token) => {
            return err ? reject(err) : resolve(token)
        }),
    )
}

export const verifyAccess = (token: string) => {
    return new Promise((resolve, reject) =>
        jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
            return err ? reject(err) : resolve(decoded)
        }),
    )
}

export const verifyRefresh = (token: string) => {
    return new Promise((resolve, reject) =>
        jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
            return err ? reject(err) : resolve(decoded)
        }),
    )
}
