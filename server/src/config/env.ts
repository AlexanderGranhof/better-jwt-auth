import dotenv from 'dotenv'
import path from 'path'

const envPath = path.resolve(__dirname, '../../../', '.env')

dotenv.config({ path: envPath })

const { ACCESS_SECRET, REFRESH_SECRET } = process.env as Record<string, string>

const createEnvErrorMessage = (name: string) => {
    return `missing environment variable ${name}. please add it to the environment or store it in an .env file located at ${envPath}`
}

if (typeof ACCESS_SECRET !== 'string' || ACCESS_SECRET.length === 0) {
    throw createEnvErrorMessage('ACCESS_SECRET')
}

if (typeof REFRESH_SECRET !== 'string' || REFRESH_SECRET.length === 0) {
    throw createEnvErrorMessage('REFRESH_SECRET')
}

export { ACCESS_SECRET, REFRESH_SECRET }
