import jwt from 'jsonwebtoken'
import { ACCESS_SECRET, ACCESS_EXPIRE, REFRESH_SECRET, REFRESH_EXPIRE } from '../config/env'

export const createAccess = (payload: Record<string, unknown>): Promise<string> => {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRE }, (err, token) => {
            return err ? reject(err) : resolve(token)
        }),
    )
}

export const createRefresh = (payload: Record<string, unknown>): Promise<string> => {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRE }, (err, token) => {
            return err ? reject(err) : resolve(token)
        }),
    )
}

export const verifyAccess = (token: string): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) =>
        jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
            return err ? reject(err) : resolve(decoded as Promise<Record<string, unknown>>)
        }),
    )
}

export const verifyRefresh = (token: string): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) =>
        jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
            return err ? reject(err) : resolve(decoded as Record<string, unknown>)
        }),
    )
}
