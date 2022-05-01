require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
})

client.on('ready', () => {
    console.log(`SmashElo bot online !\nUsername: ${client.user.tag}`)
})

client.on('messageCreate', (msg) => {
    if (msg.content == 'hi') {
        msg.reply('Hello World!')
    }
})


client.login(process.env.TOKEN)