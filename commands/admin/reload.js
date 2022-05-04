const bot = require('../../main')

module.exports = {
    name: 'reload',
    category: 'admin',
    permissions: [],
    devOnly: true,
    run: async ({client, message, args}) => {
        client.loadEvents(bot, true)
        client.loadCommands(bot, true)
        
        message.reply(`Commands and events reloaded`)
    }
}

