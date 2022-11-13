const { STATUS_CODES } = require('http')

const prefix = "$"

const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true,
        partials: ['MESSAGE','REACTION']
    }),
    config = require('./config.json'),
    fs = require('fs')
    humanizeDuration = require('humanize-duration'),
    cooldown = new Set()
 
client.login(config.token)
client.commands = new Discord.Collection()
client.db = require('./db.json')
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('ready', () => {
    const statuses = [
        () => `arteam.fr`,
        () => `RECRUTEMENTS ------> ON`,
        () => `dsc.gg/arteam`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'WATCHING'})
        i = ++i % statuses.length
    }, 1e4)
})


 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send(`***Cette Commande N'est utilisable que dans des serveurs!***`)
    command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`*** Bonjour ${member} Tu As Rejoint Le Serveur! Va Dans #846116720376807475 Pour Accéder Au Seveur!  [${member.guild.memberCount} In The Server] *** 🎉 `)

})
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`*** ${member.user.tag} est un ptn de chien de la casse. (il/elle a quitté le serveur) ***`)
})

client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles)
    else reaction.users.remove(user)
})
 
client.on('messageReactionRemove', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem || !reactionRoleElem.removable) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles)
})

client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

client.on("message", (message) => {
    if(message.content === "ping") {
    const Maj = new Discord.MessageEmbed()
    .setTitle('***[MAJ DU BOT]***')
    .setDescription('- Ajout De La Commande Ban / Tempban / Kick  \n -Système De Warn / Unwarn / Infractions \n -Système De Mute / Unmute / tempmute \n -Ajout De La Commande $link')

message.channel.send(Maj);
    }
})

client.on('messageDelete', async message => {
    if (message.content && message.content.includes("<@")){
        const emebedGhostPing = new Discord.MessageEmbed()
        .setColor("2f3136")
        .setAuthor("GHOSTPING", message.author.displayAvatarURL({dynamic: true}))
        .addField("Contenue Du Message", message.content.length < 1024 ? message.content : "Contenue Du Message Trop Long")
        .addField('Fils De Viol Qui A Ghost Ping: ', message.author.username)
        message.channel.send(emebedGhostPing)
    }
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.content && oldMessage.content.includes("<@")){
        const emebedGhostPing = new Discord.MessageEmbed()
        .setColor("2f3136")
        .setAuthor("GHOSTPING", oldMessage.author.displayAvatarURL({dynamic: true}))
        .addField("Contenue Du Message", oldMessage.content.length < 1024 ? oldMessage.content : "Contenue Du Message Trop Long")
        .addField('Fils De Viol Qui A Ghost Ping: ', oldMessage.author.username)
        oldMessage.channel.send(emebedGhostPing)
    }
})