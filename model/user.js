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

const userNewResult = (id, newElo, isWin, isDraw) => {
    console.log(`Trying to add new result (id=${id}, newElo=${newElo}, isWon=${isWin})`);

    const db = dbOpen(OPEN_READWRITE)
    db.get(
        'SELECT matchCount, winCount, drawCount FROM user WHERE discordId = ?', 
        id, 
        (err, row) => {
            if (err)
                throw err // TODO handle
            else {
                const matchCount = row?.['matchCount']
                let winCount = row?.['winCount']
                let drawCount = row?.['drawCount']

                if (isWin) 
                    winCount++
                else if (isDraw)
                    drawCount++

                db.run(
                    'UPDATE user SET (elo, matchCount, winCount, drawCount) = (?, ?, ?, ?) WHERE discordId = ?', 
                    [newElo, matchCount + 1, winCount, drawCount, id]
                )
            }

            db.close()
        }
    )
}


module.exports = {
    userElo,
    userCreate,
    userExists,
    userNewResult,
    userInfo
}