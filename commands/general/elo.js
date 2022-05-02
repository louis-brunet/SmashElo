const { userInfo } = require('../../model/user')
const { DEFAULT_ELO } = require('../../util/eloSystem')
const { getTargetUsers } = require('../../util/functions')

// const getTargetUsers = (client, message, args) => {
//     console.log(`size=${message.mentions.members.size} ; entries = ${message.mentions.members.entries()}`)
//     const targets = []

//     if (message.mentions.members.size > 0) {
//         message.mentions.members.forEach( member => {
//             targets.push(member.user)
//         })
//     }

//     const tags = []
//     for (const arg of args) {
//         if (/^.{3,32}#[0-9]{4}$/.test(arg)) {
//             tags.push(arg.toLowerCase())
//         }
//     }
    
//     if (tags.length > 0) {
//         // console.log(`tags: ${tags}; returning ${client.users.cache.filter(u =>tags.includes(u.tag.toLowerCase())).values()}`)
//         client.users.cache.forEach(u => {
//             if (tags.includes(u.tag.toLowerCase())) {
//                 targets.push(u)
//             }
//         })
//     }

//     if (targets.length === 0) {
//         targets.push(message.author)
//     }

//     return targets
// }

const run = async ({client, message, args}) => {
    // if (!validateArgs(args))
    //     return

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