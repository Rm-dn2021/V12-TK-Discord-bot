const Discord = require('discord.js')

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('***Hmmm Je Ne Vois Pas La Personne A Exclure🤔 ***')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas exclure le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('***Vous ne pouvez pas exclure une personne hiérachiquement au dessus de vous ou égale a vous ^^ *** ')
        if (!member.kickable) return message.channel.send('*** Je ne peut pas exclure cette personne car elle est malheureusement plus puissante ou égale à moi ***😢')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.kick(reason)
        message.channel.send(`${member.user.tag} a été exclu !`)
    },
    name: 'kick',
    guildOnly: true,
    description: '***Permet D\'exclure une personne ***',
    sytax: '<@membre> [raison]'
}