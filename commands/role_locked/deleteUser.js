const { userDelete } = require("../../model/user")
const { getTargetUsers } = require("../../util/functions")

const usage = (msg) => msg.reply('`Usage: !deleteUser @user1 user2#1234 ...`')

module.exports = {
    name: 'deleteUser',
    category: 'role_locked',
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        const users = getTargetUsers(client, message, args)
        if (!users || !users.length) {
            usage(message)
            return
        }
        const ids = users?.map?.(u=>u.id) || []
        
        try {
            await userDelete(ids)
            message.reply('Done')
        } catch (err) {
            console.error(err)
            message.reply('Error: could not delete users')
        }
    }
}