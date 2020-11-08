import knex from 'knex'
import path from 'path'

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'sqlite/dev.sqlite3'),
    },
    useNullAsDefault: true,
})

export const users = () => db('users')
