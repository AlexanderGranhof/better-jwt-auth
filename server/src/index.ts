import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { PORT } from './config/env'

import mainRoute from './api/routes/main'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser())

app.use(mainRoute)

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})
