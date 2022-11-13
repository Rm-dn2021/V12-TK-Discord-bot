const { gray } = require("chalk")

module.exports = {
    run: async (message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('***Hmmm Je Ne Vois Pas La Personne A Bannir🤔 ***')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas bannir le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('***Vous ne pouvez pas bannir une personne hiérachiquement au dessus de vous ou égale a vous ^^ *** ')
        if (!member.bannable) return message.channel.send('*** Je ne peut pas bannir cette personne car elle est malheureusement plus puissante ou égale à moi ***😢')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.ban({reason})
        message.channel.send(`${member.user.tag} a été banni !`)
    },
    name: 'ban',
    guildOnly: true
}
