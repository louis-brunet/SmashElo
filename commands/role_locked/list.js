const { listUsers } = require('../../model/user')
const { getTargetUsers } = require('../../util/functions')

module.exports = {
    name: 'list',
    category: 'role_locked',
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        const userIds = getTargetUsers(client, message, args).map(u=>u.id)
        const rows = await listUsers(userIds)
        if (rows.length === 0) { 
            message.reply('No users in database.')
            return
        }

        let reply = '```\ntag, elo, matchCount, winCount, drawCount, dateCreated, dateLastSeen:\n\n'

        for (const row of rows) {
            const user = client.users.cache.get(row['discordId'])
            if (!user) {
                reply += `Failed to fetch user (id=${row['discordId']})\n`
            }
            if (user) {
                const tag = user.tag
                reply += `${tag},\t${row['elo']},\t${row['matchCount']},\t${row['winCount']},\t${row['drawCount']},\t${row['dateCreated']},\t${row['dateLastSeen']}\n`
            }
        }

        reply += '```'
        message.reply(reply)
    }
}