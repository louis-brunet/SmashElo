const { getCommandRoles } = require('../../model/permissions')
const { isCommand, roleIdToName } = require('../../util/functions')

const validateArgs = (client, message, args) => { 
    const commands = args.filter(a=>isCommand(client, a)) 

    return {
        commands
    }
}

const usage = (message) => message.reply('`Usage: !cmdRoles command`')


module.exports = {
    name: 'cmdRoles',
    category: 'admin',
    permissions: [],
    devOnly: true,
    run: async ({client, message, args}) => {
        const validated = validateArgs(client, message, args)
        if (!validated || validated.commands.length === 0) {
            usage(message)
            return
        }
        const { commands } = validated
        const cmdName = commands[0]

        const cmd = client.commands.get(cmdName)
        if (cmd && cmd.devOnly) {
            message.reply(`Command \`${cmdName}\` is limited to devs.`)
            return
        } 
        
        let roleIds = []
        try {
            roleIds = await getCommandRoles(cmdName)
        } catch (err) {
            console.error(err)
        }
        
        if (roleIds?.length) {
            const guildRoles = message?.guild?.roles?.cache?.values?.()
            const roleNames = roleIds.map(rid => roleIdToName(rid, guildRoles))
            message.reply(`Command \`${cmdName}\` is limited to roles [${roleNames}]`)
        } else {
            message.reply(`Command \`${cmdName}\` is available to everyone`)
        }
    }
}
