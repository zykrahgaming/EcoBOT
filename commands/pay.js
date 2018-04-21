const Discord = require('discord.js'),
      db = require('quick.db');

exports.run = async (client, message, args, tools) => {

    if (!message.mentions.members.first()) return tools.embed(message.channel, '**Please mention a user!**');

    let targetMember = message.mentions.members.first(),
        amount = parseInt(args.join(' ').replace(targetMember, ''));
    
    if (isNaN(amount)) return tools.embed(message.channel, '**Please define an amount!**');

    let targetBalance = await db.fetch(`userBalance_${targetMember.id}`),
        selfBalance = await db.fetch(`userBalance_${message.author.id}`),
        startBalance = 0; // Starting Balance

    if (targetBalance === null) targetBalance = startBalance;
    if (selfBalance === null) selfBalance = startBalance;

    if (amount > selfBalance) return tools.embed(message.channel, '**Sorry you don\'t have enough money.**');

    db.add(`userBalance_${targetMember.id}`, amount);
    db.subtract(`userBalance_${message.author.id}`, amount);

    tools.embed(message.channel, `**Successfully sent $${amount} to ${targetMember.user.username}!**`);
}