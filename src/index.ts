import { CommandClient } from "eris"

if (!process.env.BOT_TOKEN) {
    console.error("Please set the BOT_TOKEN environment variable.")
    process.exit(1)
}

const bot = new CommandClient(process.env.BOT_TOKEN ?? '', { intents: ['guilds', 'guildMessages'] })

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.username} (${bot.user.id})`)
})

bot.on("error", (err) => {
    console.error(err)
})

// Enable graceful stop
process.once('SIGINT', () => bot.disconnect({ reconnect: false }))
process.once('SIGTERM', () => bot.disconnect({ reconnect: false }))

bot.connect()