import { CommandClient } from 'eris'

if (!process.env.BOT_TOKEN) {
    console.error('Please set the BOT_TOKEN environment variable.')
    process.exit(1)
}

const bot = new CommandClient(process.env.BOT_TOKEN ?? '', { intents: ['guilds', 'guildMessages', 'guildVoiceStates'] })

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.username} (${bot.user.id})`)
})

bot.registerCommand('join', (context) => {
    if (!context.guildID || !context.member) return

    const guildId = context.member.guild.id
    const channelID = context.member.voiceState.channelID

    if (!channelID) {
        return 'You need to be in a voice channel to use this command!'
    }

    const botVoice = bot.voiceConnections.get(guildId)
    if (botVoice && botVoice.ready && botVoice.channelID === channelID) {
        return 'I\'m already in this voice channel!'
    }

    bot.joinVoiceChannel(channelID).then((connection) => {
        connection.on('debug', (message) => {
            console.debug(`Debug from ${channelID}: ${message}`)
        })
        connection.on('warn', (message) => {
            console.warn(`Warning from ${channelID}: ${message}`)
        })
        connection.on('error', (err) => {
            console.error(`Error from voice connection ${channelID}: ${err.message}`)
            console.error(err)
        })
    })

}, { description: 'Join the voice channel you are in.', guildOnly: true })

bot.registerCommand('leave', (context) => {
    if (!context.guildID || !context.member) return

    const guildId = context.member.guild.id
    const botVoice = bot.voiceConnections.get(guildId)

    if (!botVoice) {
        return 'I\'m not in a voice channel!'
    }

    botVoice.disconnect()
}, { description: 'Leave the voice channel.', guildOnly: true })

bot.on('debug', (message) => {
    console.debug(`Debug from bot: ${message}`)
})

bot.on('warn', (message) => {
    console.warn(`Warning from bot: ${message}`)
})

bot.on('error', (err) => {
    console.error(`Error from bot: ${err.message}`)
    console.error(err)
})

// Enable graceful stop
process.once('SIGINT', () => bot.disconnect({ reconnect: false }))
process.once('SIGTERM', () => bot.disconnect({ reconnect: false }))

bot.connect()