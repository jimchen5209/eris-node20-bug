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

bot.registerCommand('play-opus', (context) => {
    if (!context.guildID || !context.member) return

    const guildId = context.member.guild.id
    const botVoice = bot.voiceConnections.get(guildId)

    if (!botVoice) {
        return 'I\'m not in a voice channel!'
    }

    botVoice.play('./audio/fdd0c99fff6f8df7f651532526f4b317.opus', { format: 'ogg', inlineVolume: true })
}, { description: 'Play the example opus file.', guildOnly: true })

bot.registerCommand('play-pcm', (context) => {
    if (!context.guildID || !context.member) return

    const guildId = context.member.guild.id
    const botVoice = bot.voiceConnections.get(guildId)

    if (!botVoice) {
        return 'I\'m not in a voice channel!'
    }

    botVoice.play('./audio/c22e51e4e5b18ed05222f1d6e9968136.pcm', { format: 'pcm', inlineVolume: true })
}, { description: 'Play the example pcm file.', guildOnly: true })

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