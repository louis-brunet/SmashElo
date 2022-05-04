const { deleteAllUsers } = require("../../model/user")
const usage = (msg) => msg.reply('`Usage: !resetAllElo`')

module.exports = {
    name: 'resetAllElo',
    category: 'role_locked',
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        if (!args || args.length) {
            usage(message)
            return
        }
        
        try {
            await deleteAllUsers()
            message.reply('Done')
        } catch (err) {
            console.error(err)
            message.reply('Error: could not delete users')
        }
    }
}