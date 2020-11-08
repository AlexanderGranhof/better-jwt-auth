import express from 'express'
import wrapAsync from 'express-async-handler'
import { authorize } from '../middleware/auth'
import { users } from '../../services/db'
import crypto from 'crypto'
import * as jwt from '../../services/jwt'
import { ACCESS_EXPIRE, REFRESH_EXPIRE } from '../../config/env'

const sha256 = (data: string) => crypto.createHash('sha256').update(data).digest('hex')

const router = express.Router()

router.get('/', (req, res) => {
    res.send(
        '<pre>\n' +
            'POST to "/login" to get a refresh_token and a access_token\n' +
            'GET to "/private" with the the authorization header "Bearer &lt;access_token&gt;"\n' +
            'POST to "/refresh" to get a new access_token' +
            '\n</pre>',
    )
})

router.get('/private', authorize, (req, res) => {
    res.send('You are accessing private content that is secured behind JWT')
})

router.post(
    '/login',
    wrapAsync(async (req, res) => {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).send()
        }

        // Add salting here
        const hashedPassword = sha256(password)

        try {
            await users().insert({ username, password: hashedPassword })

            const accessPromise = jwt.createAccess({ username })
            const refreshPromise = jwt.createRefresh({ username })

            const [access_token, refresh_token] = await Promise.all([accessPromise, refreshPromise])

            await users().where({ username }).update({ refresh_token })

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                expires: new Date(Date.now() + REFRESH_EXPIRE),
            })

            res.cookie('access_token', access_token, {
                httpOnly: true,
                expires: new Date(Date.now() + ACCESS_EXPIRE),
            })

            res.status(200).send()
        } catch (err) {
            console.log(err)

            return res.send(400)
        }
    }),
)

router.post(
    '/refresh',
    wrapAsync(async (req, res) => {
        const { refresh_token } = req.cookies

        if (!refresh_token) {
            return res.status(401).send()
        }

        try {
            const { username } = await jwt.verifyRefresh(refresh_token)

            if (!username) {
                return res.status(401).send()
            }

            const { refresh_token: refresh_token_db } = await users()
                .where({ username })
                .select('refresh_token')
                .first()

            if (refresh_token_db !== refresh_token) {
                return res.status(401).send()
            }

            // fetch payload data from db here
            const payload = { username }
            const access_token = await jwt.createAccess(payload)

            res.cookie('access_token', access_token, {
                httpOnly: true,
                expires: new Date(Date.now() + ACCESS_EXPIRE),
            })

            return res.status(200).send()
        } catch (err) {
            console.log(err)
            res.send()
        }
    }),
)

router.post(
    '/logout',
    wrapAsync(async (req, res) => {
        const { refresh_token } = req.cookies

        if (!refresh_token) {
            res.status(400).send()
        }

        try {
            const { username } = await jwt.verifyRefresh(refresh_token)

            if (!username) {
                res.status(400).send()
            }

            await users().where({ username }).update({ refresh_token: null })

            res.clearCookie('access_token')
            res.clearCookie('refresh_token')

            res.status(200).send()
        } catch (err) {
            console.log(err)

            res.status(400).send()
        }
    }),
)

export default router
