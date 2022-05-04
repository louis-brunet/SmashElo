const { dbOpen } = require('./db')
const { OPEN_READWRITE } = require('sqlite3')

const addCommandRoles = (commands, roles) => {
    if (!commands || !roles || !commands.length || !roles.length)
        return
    
    let query = 'REPLACE INTO command_role (cmdName, roleId) VALUES ' 
    const queryParams = []

    for (const cmd of commands) {
        for (const role of roles) {
            query += `(?, ?),`
            queryParams.push(cmd?.toLowerCase?.(), role?.id)
        }
    }
    query = query.slice(0, query.length - 1)
    query += ' ON CONFLICT DO NOTHING'

    const db = dbOpen(OPEN_READWRITE)

    const promise = new Promise((resolve, reject) => {
        db.run(
            query, 
            ...queryParams,
            (err) => {
                if (err)
                    reject(err)
                else
                    resolve()
            }
        )

        db.close()
    })
    
    return promise
}

const clearCommandRoles = (commands) => {
    if (!commands || !commands.length)
        return
    
    let query = 'DELETE FROM command_role WHERE cmdName IN (' 
    const queryParams = []

    for (const cmd of commands) {
        query += `?,`
        queryParams.push(cmd?.toLowerCase?.())
    }
    query = query.slice(0, query.length - 1)
    query += ')'

    const db = dbOpen(OPEN_READWRITE)

    const promise = new Promise((resolve, reject) => {
        db.run(
            query, 
            ...queryParams,
            (err) => {
                if (err)
                    reject(err)
                else
                    resolve()
            }
        )

        db.close()
    })
    
    return promise
}

const getCommandRoles = (commandName) => {
    if (!commandName)
        return []
    
    let query = 'SELECT roleId FROM command_role WHERE cmdName = ?' 

    const db = dbOpen(OPEN_READWRITE)

    const promise = new Promise((resolve, reject) => {
        db.all(
            query, 
            commandName,
            (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows?.map?.(row=>row?.['roleId']))
            }
        )

        db.close()
    })
    
    return promise
}


module.exports = {
    addCommandRoles,
    clearCommandRoles,
    getCommandRoles
}