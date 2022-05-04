const { DEFAULT_ELO } = require('../../util/eloSystem')
const { userInfo } = require('../../model/user')
const { getTargetUsers } = require('../../util/functions')

const run = async ({client, message, args}) => {
    const targets = getTargetUsers(client, message, args)
    
    if (targets.length === 0) {
        targets.push(message.author)
    }
    
    const replies = []
    for (const target of targets) {
        const id = target.id
        const name = target.tag

        let reply = ''
        try {
            let elo = DEFAULT_ELO
            let matchCount = 0
            let info = await userInfo(id)
            if (info !== undefined) {
                // user in db
                elo = info.elo
                matchCount = info.matchCount
            }
            reply += '```css\n'
            reply += `${name} [${elo} | ${matchCount} matches]\n`
            reply += '```'
        }
        catch (err) {
            // db error
            reply = `\`\`\`Error: cannot fetch elo for ${name}\`\`\``
            console.error(err)
        }

        replies.push(reply)
    }

    message.reply(replies.join('\n'))
}



module.exports = {
    name: 'elo',
    category: 'general',
    permissions: [],
    devOnly: false,
    run
}