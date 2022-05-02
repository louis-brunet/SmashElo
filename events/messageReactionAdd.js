const { UNVERIFIED_INDICATOR } = require('../commands/general/result')

module.exports = {
    name: 'messageReactionAdd',
    run: async (bot, messageReaction, user) => {
        console.log('Reaction !', messageReaction.emoji.name);
        const message = messageReaction.message
        if (!message.author.id === bot.client.user.id 
            || !message.content.startsWith(UNVERIFIED_INDICATOR)
            || messageReaction.emoji.name !== '✅'
            ) {
            return
        }

        const didBothReact = true//..................... // TODO

        if (didBothReact) {
            // TODO update db (and change result.js to not update db)


            let newContent = '```css' + message.content.split('```').slice(1).join('```')
            message.edit(newContent)
        }
    }
}