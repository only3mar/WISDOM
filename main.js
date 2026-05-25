const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
    intents: Object.values(GatewayIntentBits),
});

client.once(Events.ClientReady, (readyClient) => {
    const botInfo = {
        Name: client.user.tag,
        Id: client.user.id,
        Ping: client.ws.ping,
    };
    console.table(botInfo);

    client.user.setPresence({
        status: 'idle',
        activities: [
            {
                name: 'Wisdom.',
                type: ActivityType.Listening,
            }
        ],
    });

});

client.on('messageCreate', async(msg) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;

    const pubRoleId = '1484567853440045066';
    const stuRoleId = '1502459449082904686';

    if (!msg.member.roles.cache.has(pubRoleId)) return false;
    if (!msg.mentions.roles.has(stuRoleId)) return false;

    await msg.channel.send({
        content: "https://cdn.discordapp.com/attachments/1404832212372816033/1508429040208445541/41224142131234.png"
    });

    const emojis = {
        '1487209090194083952': '🗂️',
        '1483814381966856263': '📝',
        '1499862075009142945': '📖',
        '1476969874486984835': '📚',
        '1476969914098253957': '🌹',
        '1477112057936740535': '🔍',
        '1508420130298662952': '💎',
        '1487230799794405477': '🌿',
        '1495764904798322769': '🖋️',
        '1505093096285802526': '🔖',
        '1486838526229221527': '📑',
        '1477099072631341269': '💥',
        '1479619161557569709': '✨'
    };

    const emoji = emojis[msg.channelId];

    if (emoji) {
        await msg.react(emoji);
    };

});

client.on('messageCreate', async(msg) => {

    if(msg.content === 'ping') {
        msg.reply('pong');
    };

});

client.login(process.env.TOKEN);