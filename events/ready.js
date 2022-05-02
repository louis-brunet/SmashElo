const { dbInit } = require('../model/db')

module.exports = {
    name: 'ready',
    run: async (bot) => {
        dbInit()
        console.log(`SmashElo bot is online !\nUsername: ${bot.client.user.tag}`)
    }
}