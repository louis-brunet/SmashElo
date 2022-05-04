const validateArgs = (client, message, args) => { /*TODO*/ }
const usage = (message) => message.reply('todo' /*TODO*/ )

module.exports = {
    name: 'edit',
    category: 'role_locked',
    permissions: [],
    devOnly: false,
    run: async ({client, message, args}) => {
        const validated = validateArgs(client, message, args)
        if (!validated /*|| TODO ............... */) {
            usage(message)
            return
        }

        // TODO ..............................

        message.reply('TODO')
    }
}