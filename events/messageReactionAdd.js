const { UNVERIFIED_INDICATOR, VALIDATION_EMOTE_NAME } = require('../commands/general/result');
const { userNewResult } = require('../model/user');
const { didBothPlayersValidateResult, parseResultValidationMessage } = require('../util/functions');

const isUnvalidatedResultReply = (bot, message) => {
    return message.author.id === bot.client.user.id 
        && message.content.startsWith(UNVERIFIED_INDICATOR)
}


module.exports = {
    name: 'messageReactionAdd',
    run: async (bot, messageReaction, user) => {
        console.log('Reaction !', messageReaction.emoji.name);
        const message = messageReaction.message
        if (!isUnvalidatedResultReply(bot, message) || messageReaction.emoji.name !== VALIDATION_EMOTE_NAME) {
            return
        }

        const { tag1, tag2, isWin1, isDraw, newElo1, newElo2 } = parseResultValidationMessage(message)
        const user1 = bot.client.users.cache.find(u=>u.tag.toLowerCase()===tag1)
        const user2 = bot.client.users.cache.find(u=>u.tag.toLowerCase()===tag2)

        if (!user1 || !user2) {
            console.error('messageReactionAdd.run: could not parse both users in message')
            return
        }

        console.log(tag1, tag2);

        if (didBothPlayersValidateResult(tag1, tag2, message, VALIDATION_EMOTE_NAME)) {
            // update db
            userNewResult(user1.id, newElo1, isWin1, isDraw)
            userNewResult(user2.id, newElo2, !isWin1 && !isDraw, isDraw)

            let newContent = '```css' + message.content.split('```').slice(1).join('```')
            message.edit(newContent)
        } 
        else {
            console.log('Both players have not validated the result yet!')
        }
    }
}