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

    const blockedChannels = [
        '1505101671506640977',
        '1487209090194083952',
        '1483814381966856263',
        '1499862075009142945',
        '1476969874486984835',
        '1476969914098253957',
        '1477112057936740535',
        '1508420130298662952',
        '1487230799794405477',
        '1495764904798322769',
        '1505093096285802526',
        '1486838526229221527',
        '1477099072631341269',
        '1479619161557569709',
    ];

    if (blockedChannels.includes(msg.channel.id)) return;

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
        const content = msg.content.trim().toLowerCase();
        const matched = trigger.keywords.some(k => content.startsWith(k));
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
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MoveMembers,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.DeafenMembers,
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.Connect,
                        PermissionFlagsBits.Speak,
                        PermissionFlagsBits.Stream,
                        PermissionFlagsBits.PrioritySpeaker,
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



const TRIGGER_CHANNEL_ID  = '1404820170609787011';
const TICKET_CATEGORY_ID  = '1509660257872511036';
const LOG_CHANNEL_ID      = '1509660404912230430';
const MOD_ROLE_ID         = '1489381789301735465';

const activeTickets = new Map(); // userId -> channelId

// Create ticket on #سؤال
client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.channel.id !== TRIGGER_CHANNEL_ID) return;
    if (msg.content.trim() !== '#سؤال') return;

    await msg.delete().catch(() => {});

    if (activeTickets.has(msg.author.id)) {
        const existing = msg.guild.channels.cache.get(activeTickets.get(msg.author.id));
        const warn = await msg.channel.send({
            content: `<@${msg.author.id}> لديك تذكرة مفتوحة بالفعل: ${existing ?? 'غير موجودة'}`,
        });
        setTimeout(() => warn.delete().catch(() => {}), 5000);
        return;
    }

    const ticketChannel = await msg.guild.channels.create({
        name: `question-${msg.member.displayName}`.toLowerCase().replace(/\s+/g, '-'),
        type: ChannelType.GuildText,
        parent: TICKET_CATEGORY_ID,
        permissionOverwrites: [
            {
                id: msg.guild.id, // @everyone
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: msg.author.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.AttachFiles,
                ],
            },
            {
                id: MOD_ROLE_ID,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.AttachFiles,
                ],
            },
        ],
    });

    activeTickets.set(msg.author.id, ticketChannel.id);

    // Welcome message inside the ticket
    const welcomeEmbed = new EmbedBuilder()
        .setTitle('📩 تذكرة جديدة')
        .setDescription(`مرحباً <@${msg.author.id}>، سيتم الرد عليك في أقرب وقت.\nيمكنك كتابة سؤالك هنا.`)
        .setColor('#5865F2')
        .setFooter({ text: `ID: ${msg.author.id}` })
        .setTimestamp();

    const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`close_ticket_${msg.author.id}`)
            .setLabel('إغلاق التذكرة')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
    );

    await ticketChannel.send({ embeds: [welcomeEmbed], components: [closeRow] });

    // Log message in mod channel with claim button
    const logEmbed = new EmbedBuilder()
        .setTitle('🎫 تذكرة جديدة')
        .addFields(
            { name: '👤 المستخدم',  value: `<@${msg.author.id}>`,  inline: true },
            { name: '🆔 ID',         value: msg.author.id,           inline: true },
            { name: '📅 التاريخ',   value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '📌 القناة',    value: `${ticketChannel}`,       inline: false },
        )
        .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
        .setColor('#57F287')
        .setTimestamp();

    const claimRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`claim_ticket_${msg.author.id}`)
            .setLabel('استلام التذكرة')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✋'),
        new ButtonBuilder()
            .setCustomId(`close_ticket_${msg.author.id}`)
            .setLabel('إغلاق')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
    );

    const logChannel = msg.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) await logChannel.send({ embeds: [logEmbed], components: [claimRow] });

    console.log(`Ticket created: ${ticketChannel.name}`);
});


// Handle buttons (claim + close)
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId, member, guild } = interaction;
    const isMod = member.roles.cache.has(MOD_ROLE_ID);

    // ── Claim ticket ──────────────────────────────────────────
    if (customId.startsWith('claim_ticket_')) {
        if (!isMod) {
            return interaction.reply({ content: 'ليس لديك صلاحية لاستلام التذكرة.', ephemeral: true });
        }

        const ownerId    = customId.replace('claim_ticket_', '');
        const channelId  = activeTickets.get(ownerId);
        const channel    = guild.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({ content: 'التذكرة غير موجودة أو تم حذفها.', ephemeral: true });
        }

        // Remove all other mods — only claimer can see it now
        await channel.permissionOverwrites.edit(MOD_ROLE_ID, {
            ViewChannel: false,
        });

        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel:        true,
            SendMessages:       true,
            ReadMessageHistory: true,
            ManageMessages:     true,
            AttachFiles:        true,
        });

        const claimEmbed = new EmbedBuilder()
            .setDescription(`✋ تم استلام التذكرة من قِبَل <@${member.id}>`)
            .setColor('#FEE75C')
            .setTimestamp();

        await channel.send({ embeds: [claimEmbed] });

        // Update log message — disable the claim button
        const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`claim_ticket_${ownerId}`)
                .setLabel(`استُلمت بواسطة ${member.displayName}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('✋')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`close_ticket_${ownerId}`)
                .setLabel('إغلاق')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒'),
        );

        await interaction.update({ components: [disabledRow] });
        console.log(`Ticket claimed by ${member.user.tag}`);
    }

    // ── Close ticket ──────────────────────────────────────────
    if (customId.startsWith('close_ticket_')) {
        const ownerId = customId.replace('close_ticket_', '');

        if (!isMod && member.id !== ownerId) {
            return interaction.reply({ content: 'ليس لديك صلاحية لإغلاق هذه التذكرة.', ephemeral: true });
        }

        const channelId = activeTickets.get(ownerId);
        const channel   = guild.channels.cache.get(channelId);

        if (!channel) {
            activeTickets.delete(ownerId);
            return interaction.reply({ content: 'التذكرة غير موجودة.', ephemeral: true });
        }

        const closeEmbed = new EmbedBuilder()
            .setDescription(`🔒 جارٍ إغلاق التذكرة بواسطة <@${member.id}>...`)
            .setColor('#ED4245')
            .setTimestamp();

        await interaction.reply({ embeds: [closeEmbed] });

        // Log closure
        const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) {
            const closedEmbed = new EmbedBuilder()
                .setTitle('🔒 تذكرة مغلقة')
                .addFields(
                    { name: '👤 صاحب التذكرة', value: `<@${ownerId}>`,    inline: true },
                    { name: '🔒 أغلقها',        value: `<@${member.id}>`, inline: true },
                )
                .setColor('#ED4245')
                .setTimestamp();
            await logChannel.send({ embeds: [closedEmbed] });
        }

        activeTickets.delete(ownerId);

        setTimeout(async () => {
            await channel.delete().catch(console.error);
        }, 3000);
    }
});



client.login(process.env.TOKEN);