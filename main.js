const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const client = new Client({ intents: Object.values(GatewayIntentBits) });

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
                name: 'حكمة',
                type: ActivityType.Listening,
            }
        ],
    });
});

// Commands
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.channel.id !== '1404820193758412810') return;

    const prefix = '!';
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/\s+/);
    const command = args[0].toLowerCase();

    const target = msg.mentions.users.first() 
        ? await msg.guild.members.fetch(msg.mentions.users.first().id)
        : msg.member;

    const user = await target.user.fetch(); // fetch to get banner

    // userInfo
    if (command === 'user') {
        const roles = target.roles.cache
            .filter(r => r.id !== msg.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => r.toString())
            .join(', ') || 'None';

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#4195bc')
            .addFields(
                { name: 'User ID',      value: user.id,                                              inline: true },
                { name: 'Bot',          value: user.bot ? 'Yes' : 'No',                              inline: true },
                { name: 'Created',      value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,  inline: true },
                { name: 'Joined',       value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
                { name: 'Accent Color', value: user.hexAccentColor || 'None',                        inline: true },
                { name: 'Roles',        value: roles,                                                inline: false }
            )
            .setFooter({ text: `Requested by ${msg.author.username}` })
            .setTimestamp();

        return msg.reply({ embeds: [embed] });
    }

    // avatar
    if (command === 'avatar') {
        const formats = ['png', 'jpg', 'webp', ...(user.avatar?.startsWith('a_') ? ['gif'] : [])];
        const links = formats.map(f =>
            `[${f.toUpperCase()}](${user.displayAvatarURL({ extension: f, size: 1024 })})`
        ).join(' • ');

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor('#4195bc')
            .setDescription(links)
            .setFooter({ text: `Requested by ${msg.author.username}` })
            .setTimestamp();

        return msg.reply({ embeds: [embed] });
    }

    // banner
    if (command === 'banner') {
        if (!user.banner) {
            return msg.reply({ content: `**${user.tag}** has no banner.` });
        }

        const formats = ['png', 'jpg', 'webp', ...(user.banner?.startsWith('a_') ? ['gif'] : [])];
        const links = formats.map(f =>
            `[${f.toUpperCase()}](${user.bannerURL({ extension: f, size: 1024 })})`
        ).join(' • ');

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Banner`)
            .setImage(user.bannerURL({ dynamic: true, size: 1024 }))
            .setColor('#4195bc')
            .setDescription(links)
            .setFooter({ text: `Requested by ${msg.author.username}` })
            .setTimestamp();

        return msg.reply({ embeds: [embed] });
    }

    // serverInfo
    if (command === 'server') {
        const guild = await msg.guild.fetch();

        const channels = guild.channels.cache;
        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;

        const embed = new EmbedBuilder()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setColor('#4195bc')
            .addFields(
                { name: 'Server ID',    value: guild.id,                                              inline: true  },
                { name: 'Owner',        value: `<@${guild.ownerId}>`,                                 inline: true  },
                { name: 'Created',      value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,  inline: true  },
                { name: 'Members',      value: `${guild.memberCount}`,                                inline: true  },
                { name: 'Text',         value: `${textChannels}`,                                     inline: true  },
                { name: 'Voice',        value: `${voiceChannels}`,                                    inline: true  },
                { name: 'Boost Level',  value: `Level ${guild.premiumTier}`,                          inline: true  },
                { name: 'Boosts',       value: `${guild.premiumSubscriptionCount}`,                   inline: true  },
                { name: 'Locale',       value: guild.preferredLocale,                                 inline: true  },
            )
            .setImage(guild.bannerURL({ size: 1024 }) || null)
            .setFooter({ text: `Requested by ${msg.author.username}` })
            .setTimestamp();

        return msg.reply({ embeds: [embed] });
    }

});


// Line & Reaction
client.on(Events.MessageCreate, async(msg) => {
    if (msg.author.bot || !msg.guild) return;

    const pubRoleId = '1484567853440045066';
    const stuRoleId = '1502459449082904686';

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

    try {
        if (!msg.member.roles.cache.has(pubRoleId)) return;
        if (!msg.mentions.roles.has(stuRoleId)) return;

        const emoji = emojis[msg.channelId];

        await msg.channel.send({
            content: "https://cdn.discordapp.com/attachments/1404832212372816033/1508429040208445541/41224142131234.png"
        });

        if (emoji) {
            await msg.react(emoji);
        };

    } catch (err) {
        console.error(`Failed to send message in ${msg.channel.name}:`, err);
    }

});


// Auto Responder
const cooldowns = new Map();
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    const COOLDOWN_MS = 5000; // 5 seconds

    const triggers = [
        {
            keywords: [
                'سلام',
                'السلام',
                'سلام عليكم',
                'السلام عليكم',
                'سلام عليكم ورحمة الله',
                'السلام عليكم ورحمة الله',
                'سلام عليكم ورحمة الله وبركاته',
                'السلام عليكم ورحمة الله وبركاته'
            ],
            response: '**وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ**',
            cooldown: 10000,
        },
    ];

    for (const trigger of triggers) {
        const content = msg.content.toLowerCase();
        const matched = trigger.keywords.some(k => content.includes(k));
        if (!matched) continue;

        const key = `${msg.author.id}-${trigger.keywords[0]}`;
        const lastUsed = cooldowns.get(key) || 0;
        const remaining = trigger.cooldown - (Date.now() - lastUsed);

        if (remaining > 0) {
            const seconds = (remaining / 1000).toFixed(1);
            const warn = await msg.reply(`مو فاضي لك الحين بعد **${seconds}** ثواني أرد عليك..`);
            setTimeout(() => warn.delete().catch(() => {}), 5000);
            continue;
        }

        cooldowns.set(key, Date.now());
        await msg.reply({ content: trigger.response });
    }
});






// TempChannels
const tempChannels = new Map();
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const TRIGGER_CHANNEL_ID = '1509183748758044742';
    const CATEGORY_ID        = '1509183627785666730';

    // User joins the trigger channel
    if (newState.channelId === TRIGGER_CHANNEL_ID) {
        const member = newState.member;

        const tempChannel = await newState.guild.channels.create({
            name: `${member.displayName}`,
            type: ChannelType.GuildVoice,
            parent: CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MoveMembers,
                        PermissionFlagsBits.MuteMembers,
                    ],
                },
                {
                    id: '1489381789301735465',
                    allow: [
                        PermissionFlagsBits.Administrator,
                    ],
                },
            ],
        });

        tempChannels.set(tempChannel.id, { ownerId: member.id, timeout: null });

        await member.voice.setChannel(tempChannel);
        console.log(`Created temp channel: ${tempChannel.name}`);
    }

    // User leaves a temp channel
    if (oldState.channelId && tempChannels.has(oldState.channelId)) {
        const channelId = oldState.channelId;
        const data      = tempChannels.get(channelId);
        const channel   = oldState.guild.channels.cache.get(channelId);

        if (!channel) return tempChannels.delete(channelId);

        const isOwner = oldState.member.id === data.ownerId;
        const isEmpty = channel.members.size === 0;

        // Delete after 3s if owner left or channel is empty
        if (isOwner || isEmpty) {
            if (data.timeout) clearTimeout(data.timeout);

            data.timeout = setTimeout(async () => {
                const fresh = oldState.guild.channels.cache.get(channelId);
                if (!fresh) return tempChannels.delete(channelId);

                // Only delete if owner is still gone or channel is still empty
                const ownerStillGone = !fresh.members.has(data.ownerId);
                const stillEmpty     = fresh.members.size === 0;

                if (ownerStillGone || stillEmpty) {
                    await fresh.delete().catch(console.error);
                    tempChannels.delete(channelId);
                    console.log(`Deleted temp channel: ${fresh.name}`);
                }
            }, 3000);
        }
    }
});

// Auto Role
client.on(Events.GuildMemberAdd, async (member) => {
    const MemberRole = '1404843183325843468';
    const BotsRole = '1404843194537213952';

    try {
        const roleId = member.user.bot ? BotsRole : MemberRole;

        if (member.roles.cache.has(roleId)) return;

        await member.roles.add(roleId);

        console.log(
            `Added ${member.user.bot ? 'bot' : 'member'} role to ${member.user.tag}`
        );
    } catch (err) {
        console.error(`Failed to add role to ${member.user.tag}:`, err);
    }
});

client.login(process.env.TOKEN);