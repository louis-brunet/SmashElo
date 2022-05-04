const bot = require('../../main')
const helpMsg = //'```\n'+
                `\`${bot.prefix}elo\` - show your elo\n` +
                `\`${bot.prefix}elo @user1 user2#1234 ...\` - show elo of user(s)\n` +
                `\`${bot.prefix}result @user1 @user2 score1 score2\` - add match result. Both users validate the result.\n` //+
                //'```'


module.exports = {
    name: 'help',
    category: 'general',
    permissions: [],
    devOnly: false,
    run: async({client, message, args}) => {
        message.reply(helpMsg)
    }
}