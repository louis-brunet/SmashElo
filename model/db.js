/**
 * TABLES
 * 
 * user 
 *      discordId   INTEGER PRIMARY KEY
 *      elo         INTEGER NOT NULL
 *      dateCreated DATETIME DEFAULT current_timestamp NOT NULL
 *      matchCount  INTEGER DEFAULT 0
 *      winCount    INTEGER DEFAULT 0
 *      drawCount   INTEGER DEFAULT 0
 */

const sqlite = require('sqlite3')
const DB_FILE = 'smashelo.sqlite'

const dbOpen = (mode = sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, fileName = DB_FILE) => {
    return new sqlite.Database(fileName, mode, (err) => {
        if (err)
            throw err
    })
}

const dbInit = () => {
    const db = dbOpen()
    db.run("CREATE TABLE IF NOT EXISTS user (discordId INTEGER PRIMARY KEY, elo INTEGER NOT NULL, dateCreated DATETIME DEFAULT current_timestamp NOT NULL, matchCount INTEGER DEFAULT 0, winCount INTEGER DEFAULT 0, drawCount INTEGER DEFAULT 0);");
    db.close()
} 

module.exports = {
    dbInit,
    dbOpen
}