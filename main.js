require('dotenv').config()
require('./model/db') // init db
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
    ]
})
// const CHANNEL_RESULTS = '970347885541601290'


client.commands = new Discord.Collection()
client.events = new Discord.Collection()

client.loadEvents = (bot, reload) => require('./handlers/events')(bot, reload)
client.loadCommands = (bot, reload) => require('./handlers/commands')(bot, reload)

const bot = {
    client,
    prefix: "!",
    owners: ['362100663355965450'] // TODO
}
module.exports = bot

client.loadEvents(bot, false)
client.loadCommands(bot, false)

client.login(process.env.TOKEN)