/**
 * TABLES
 * 
 * user 
 *      discordId   TEXT PRIMARY KEY
 *      elo         INTEGER NOT NULL
 *      dateCreated DATETIME DEFAULT current_timestamp NOT NULL
 *      dateLastSeenDATETIME DEFAULT current_timestamp NOT NULL
 *      matchCount  INTEGER DEFAULT 0
 *      winCount    INTEGER DEFAULT 0
 *      drawCount   INTEGER DEFAULT 0
 * 
 * command_role
 *      cmdName        TEXT
 *      roleId         TEXT
 *      PRIMARY KEY (cmdName, roleId)  
 */

const sqlite = require('sqlite3').verbose()
const DB_FILE = 'smashelo.sqlite'

const dbOpen = (mode = sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, fileName = DB_FILE) => {
    return new sqlite.Database(fileName, mode, (err) => {
        if (err)
            console.error(err)
    })
}

const dbInit = () => {
    const db = dbOpen()
    db.run("CREATE TABLE IF NOT EXISTS user (discordId TEXT PRIMARY KEY, elo INTEGER NOT NULL, dateCreated DATETIME DEFAULT current_timestamp NOT NULL, matchCount INTEGER DEFAULT 0, winCount INTEGER DEFAULT 0, drawCount INTEGER DEFAULT 0, dateLastSeen DATETIME DEFAULT current_timestamp NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS command_role (cmdName TEXT, roleId TEXT, PRIMARY KEY (cmdName, roleId));");
    db.close()
} 

module.exports = {
    dbInit,
    dbOpen
}