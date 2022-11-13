const Discord = require('discord.js')

module.exports = {
    run: message => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('***Link***')
            .setDescription('[Link Du Bot](https://bit.ly/352vKfI)')
            .setColor('RANDOM')
        
        )},
    name: 'link'
}