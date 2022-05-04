const { MessageMentions: {ROLES_PATTERN}} = require('discord.js')
const { addCommandRoles } = require('../../model/permissions')
const { isCommand } = require('../../util/functions')

const validateArgs = (client, message, args) => { 
    if (! message?.mentions?.roles?.size) {
        return undefined
    }
    
    const commands = args.filter(a=>isCommand(client, a)) 
    const roles = Array.from(message.mentions.roles.values())

    return {
        commands,
        roles
    }
}
const usage = (message) => message.reply('`Usage: !addCmdRole cmd1 cmd2 ... @role1 @role2 ...`')


module.exports = {
    name: 'addCmdRole',
    category: 'admin',
    permissions: [],
    devOnly: true,
    run: async ({client, message, args}) => {
        const validated = validateArgs(client, message, args)
        if (!validated || validated.commands.length === 0) {
            usage(message)
            return
        }
        const { roles, commands } = validated
        
        try {
            await addCommandRoles(commands, roles)
        } catch (err) {
            console.error(err)
        }
        
        message.reply(`Added roles \`[${roles.map(r=>r.name)}]\` to commands \`[${commands}]\`.`)
    }
}
