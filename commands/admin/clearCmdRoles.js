const { clearCommandRoles } = require('../../model/permissions')
const { isCommand } = require('../../util/functions')

const validateArgs = (client, message, args) => { 
    const commands = args.filter(a=>isCommand(client, a)) 

    return {
        commands
    }
}

const usage = (message) => message.reply('`Usage: !clearCmdRoles cmd1 cmd2 ...`')


module.exports = {
    name: 'clearCmdRoles',
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
        
        try {
            await clearCommandRoles(commands)
        } catch (err) {
            console.error(err)
        }
        
        message.reply(`Cleared all role restrictions for commands \`[${commands}]\`.`)
    }
}
