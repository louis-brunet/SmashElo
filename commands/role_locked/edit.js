const { userEdit } = require("../../model/user")
const { getTargetUsers } = require("../../util/functions")

const validateArgs = (client, message, args) => { 
    const users = getTargetUsers(client, message, args)
    if (!users || users.length !== 1) {
        return false
    }

    const ints = args?.filter?.(isPositiveInteger)?.map?.(s=>parseInt(s,10))
    if (!ints || ints.length !== 4) {
        return false
    }

    return {
        user: users?.[0],
        elo: ints?.[0],
        matchCount: ints?.[1],
        winCount: ints?.[2],
        drawCount: ints?.[3],
    }

}

const isPositiveInteger = (n) => {
    return n>>>0 === parseFloat(n)
}

const usage = (message) => message.reply('`Usage: !edit <user> <elo> <matchCount> <winCount> <drawCount>`')

module.exports = {
    name: 'edit',
    category: 'role_locked',
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        const validated = validateArgs(client, message, args)
        if (!validated) {
            usage(message)
            return
        }

        const { user, elo, matchCount, winCount, drawCount } = validated
        try {
            await userEdit(user?.id, elo, matchCount, winCount, drawCount)
            message.reply(`Done`)
        } catch (err) {
            console.error(err)
            message.reply('Error')
        }
        
    }
}