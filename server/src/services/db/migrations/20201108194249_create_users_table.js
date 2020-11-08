exports.up = function (knex) {
    const users = knex.schema.createTable('users', (table) => {
        table.increments('id')
        table.string('username').unique()
        table.string('password')
        table.string('refresh_token')
    })

    return Promise.all([users])
}

exports.down = function (knex) {
    knex.schema.dropTable('users')
}
