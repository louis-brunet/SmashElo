const { dbOpen } = require('./db')
const { OPEN_READONLY, OPEN_READWRITE } = require('sqlite3')
const { DEFAULT_ELO } = require('../util/eloSystem')


/**
 * Returns a Promise. Resolves to DEFAULT_ELO if user not in DB.
 * 
 * @param id 
 */
const userElo = async (id) => {
    const elo = (await userInfo(id))?.elo

    if (elo === undefined)
        return DEFAULT_ELO
    
    return elo 
}

/**
 * Returns a Promise. Resolves to undefined if user not in DB.
 * 
 * @param id 
 */
 const userInfo = (id) => {
    const db = dbOpen(OPEN_READONLY)

    let promise = new Promise( (resolve, reject) => {
        db.get(
            'SELECT discordId, elo, dateCreated, matchCount FROM user WHERE discordId = ?', 
            [id], 
            (err, row) => {
                if (err)
                    reject(err)
                else {
                    if (row) {
                        resolve({
                            discordId:  row?.['discordId'],
                            elo:        row?.['elo'],
                            dateCreated:row?.['dateCreated'],
                            matchCount: row?.['matchCount']
                        })
                    }
                    else {
                        resolve(undefined)
                    }
                }   
            }
        )
            
        db.close()
    })

    // db.get('SELECT elo FROM user WHERE discordId = ?', [id], (err, row) => callback(err, row?.['elo']))
    // db.close()

    return promise
}

/**
 * Returns a Promise
 * @param id 
 */
const userExists = (id) => {
    const db = dbOpen(OPEN_READONLY)
    const promise = new Promise((resolve, reject) => {
        db.get(
            'SELECT discordId FROM user WHERE discordId = ?', 
            id, 
            (err, row) => {
                if (err)
                    reject(err)
                else
                    resolve(!!row?.['discordId'])
            }
        )

        db.close()
    })
    
    return promise
}

const userCreate = (id) => {
    console.log(`Trying to create user (id=${id})`);
    const db = dbOpen(OPEN_READWRITE)
    db.run('INSERT INTO user (discordId, elo) VALUES (?, ?)', id, DEFAULT_ELO)
    db.close()
}

const userDelete = (ids) => {
    if (!ids || !ids.length) return

    console.log(`Trying to delete users (ids=${ids})`);
    const db = dbOpen(OPEN_READWRITE)

    let query = 'DELETE FROM user WHERE discordId IN (' 
    const queryParams = []

    for (const id of ids) {
        query += `?,`
        queryParams.push(id)
    }
    query = query.slice(0, query.length - 1)
    query += ')'
    
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

const userEdit = (id, elo, matchCount, winCount, drawCount) => {
    console.log(`Trying to edit user (id, elo, matchCount, winCount, drawCount) = ${id}, ${elo}, ${matchCount}, ${winCount}, ${drawCount}`);
    const db = dbOpen(OPEN_READWRITE)
    const promise = new Promise((resolve, reject) => {
        db.run(
            'UPDATE user SET (elo, matchCount, winCount, drawCount) = (?,?,?,?) WHERE discordId = ?',
            [elo, matchCount, winCount, drawCount, id],
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

const deleteAllUsers = () => {
    console.log(`Trying to delete all users`);
    const db = dbOpen(OPEN_READWRITE)

    let query = 'DELETE FROM user' 
    
    const promise = new Promise((resolve, reject) => {
        db.run(
            query, 
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

const userNewResult = async (id, newElo, isWin, isDraw) => {
    console.log(`Trying to add new result (id=${id}, newElo=${newElo}, isWon=${isWin})`);

    const db = dbOpen(OPEN_READWRITE)
    const promise = new Promise((resolve, reject) => {

        db.get(
            'SELECT matchCount, winCount, drawCount FROM user WHERE discordId = ?', 
            id, 
            (err, row) => {
                if (err)
                    reject(err) // TODO handle
                else {
                    const matchCount = row?.['matchCount']
                    let winCount = row?.['winCount']
                    let drawCount = row?.['drawCount']

                    if (isWin) 
                        winCount++
                    else if (isDraw)
                        drawCount++

                    db.run(
                        "UPDATE user SET (elo, matchCount, winCount, drawCount, dateLastSeen) = (?, ?, ?, ?, datetime('now', 'localtime')) WHERE discordId = ?", 
                        [newElo, matchCount + 1, winCount, drawCount, id],
                        (err) => {
                            if (err) reject(err)
                            else resolve()
                        }
                    )
                }

                db.close()
            }
        )
    })
    return promise
}

const listAllUsers = () => {
    const db = dbOpen(OPEN_READONLY)
    const promise = new Promise((resolve, reject) => {
        db.all(
            'SELECT discordId, elo, matchCount, winCount, drawCount, dateCreated, dateLastSeen FROM user ORDER BY elo DESC', 
            (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            }
        )

        db.close()
    })
    
    return promise
}

const listUsers = (ids) => {
    let where = ''
    if (!!ids && ids.length > 0) {
        where += ' WHERE discordId IN ('
        for (const id of ids) {
            where += `?,`
        }
        where = where.slice(0, where.length-1) + ')'
    } else {
        return listAllUsers()
    }

    const select = `SELECT discordId, elo, matchCount, winCount, drawCount, dateCreated, dateLastSeen FROM user ${where} ORDER BY elo DESC`
    // console.log('Selecting : ', select, ...ids);

    const db = dbOpen(OPEN_READONLY)
    const promise = new Promise((resolve, reject) => {
        db.all(
            select, 
            ...ids,
            (err, rows) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            }
        )

        db.close()
    })
    
    return promise
}


module.exports = {
    userElo,
    userCreate,
    userDelete,
    userEdit,
    userExists,
    userNewResult,
    userInfo,
    listUsers,
    deleteAllUsers
}