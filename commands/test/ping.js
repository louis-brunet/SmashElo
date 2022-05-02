module.exports = {
    name: 'ping',
    category: 'test',
    permissions: [],
    devOnly: true,
    run: async({client, message, args}) => {
        message.reply('Pong')
    }
}