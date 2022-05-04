const Discord = require('discord.js')
const { getCommandRoles } = require('../model/permissions')

// const { UNVERIFIED_INDICATOR, VALIDATION_EMOTE_NAME } = require('../commands/general/result')

const canAnyRoleUseCmd = async (roles, cmd) => {
    const cmdRoleIds = await getCommandRoles(cmd?.name)
    // console.log('messageCreated.canAnyRoleUseCmd: cmdRoleIds = ', cmdRoleIds);
    // console.log('messageCreated.canAnyRoleUseCmd: roles = ', roles);
    if (cmdRoleIds?.length) {
        if (roles?.length) {
            // console.log('messageCreated.canAnyRoleUseCmd: returning ', roles.some(role=>cmdRoleIds?.includes?.(role.id)));
            return roles.some(role=>cmdRoleIds?.includes?.(role.id))
        }

        return false
    } 
    return true
}

const canMemberUseCmd = async (member, cmd, owners) => {
    const missingDevAccess = cmd.devOnly && !owners?.includes?.(member?.id)
    const missingPerms = cmd?.permissions && member?.permissions?.missing?.(cmd?.permissions)?.length !== 0 
    return !missingDevAccess && !missingPerms && await canAnyRoleUseCmd(Array.from(member?.roles?.cache?.values()), cmd)
}

module.exports = {
    name: 'messageCreate',
    run: async function runAll(bot, message) {
        const { client, prefix, owners } = bot

        if (!message.guild) return
        if (!message.content.startsWith(prefix)) return
        if (message.author.bot) {
            return
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmdstr = args.shift().toLowerCase()

        let command = client.commands.get(cmdstr)
        if (!command) return

        let member = message.member

        // if (command.devOnly && !owners.includes(member.id)) {
        //     return message.reply('This command is only available to the bot owners')
        // }

        if ( ! await canMemberUseCmd(member, command, owners) ) {
            return message.reply("You do not have permission to use this command")
        }

        try {
            await command.run({...bot, message, args})
        }
        catch(err) {
            let errMsg = err.toString()

            if (errMsg.startsWith('?')) {
                errMsg = errMsg.slice(1)
                await message.reply(errMsg)
            }
            else
                console.error(err)
        }
    }
}