// const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const { computeMatchResult, DEFAULT_ELO } = require('../../util/eloSystem')
const { userElo, userNewResult, userExists, userCreate } = require('../../model/user')

const VALIDATION_EMOTE = ':white_check_mark:'
const UNVERIFIED_INDICATOR = ':hourglass:'


const run = async ({client, message, args}) => {
    const { error, user1, user2, score1, score2 } = parseArgs(client, message, args)

    if (error) {
        message.reply('```'+error+'```')

        return
    }

    // get p1, p2 ratings
    let elo1 = DEFAULT_ELO 
    let elo2 = DEFAULT_ELO 

    try {
        if (await userExists(user1.id))
            elo1 = await userElo(user1.id)
        else 
            userCreate(user1.id)

        if (await userExists(user2.id))
            elo2 = await userElo(user2.id)
        else
            userCreate(user2.id)
    }
    catch (err) {
        message.reply('```Error: could not fetch user info```')
        console.error(err)
        return
    }

    // compute new ratings 
    const { newElo1, newElo2, /*change1, change2*/ } = computeMatchResult(elo1, elo2, score1, score2)

    // update db
    userNewResult(user1.id, newElo1, score1 > score2, score1 === score2)
    userNewResult(user2.id, newElo2, score2 > score1, score1 === score2)

    reply = `${UNVERIFIED_INDICATOR} ${user1} ${user2} please react with ${VALIDATION_EMOTE}\n`
    reply += '```\n'
    reply += `${user1.tag} [${elo1} -> ${newElo1}]\n`
    reply += `${user2.tag} [${elo2} -> ${newElo2}]\n`
    reply += '```'

    message.reply(reply)
}

const parseArgs = (client, message, args) => {
    const res = {
        error: undefined, 
        user1: undefined,
        user2: undefined, 
        score1: undefined,
        score2: undefined,
    }

    if (message.mentions.members.size !== 2) {
        res.error = "Please tag both players (@player1 @player2)."
        return res
    }

    // const mentioned = message.mentions.members.values()
    res.user1 = message.mentions.members.at(0).user
    res.user2 = message.mentions.members.at(1).user
    // res.user1 = getUserFromMention(mentioned.next())
    // res.user2 = getUserFromMention(mentioned.next())

    console.log('args before regex filter : ', args)
    const scores = args.filter(a => /^\d{1,3}$/.test(a) )
    if (scores.length !== 2) {
        res.error = "Please write both scores as integers (1-3 digits)."
        return res
    }

    res.score1 = scores[0]
    res.score2 = scores[1]

    return res
}

// const getUserFromMention = (mention, client) => {
//     // const matches = mention.matchAll(USERS_PATTERN).next().value
//     // if (!matches) return
//     // const id = matches[1]
//     // return client.users.cache.get(id)
//     return member.user
// } 


module.exports = {
    name: 'result',
    category: 'general',
    permissions: [],
    devOnly: false,
    run,
    UNVERIFIED_INDICATOR
}