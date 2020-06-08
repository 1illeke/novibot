const Commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;

class AddCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'add',
            aliases: ['create', 'new', 'add-config', 'config', 'add-feedback', 'feedback'],
            group: 'util',
            memberName: 'add',
            description: 'Add a config',
            examples: ['add "config #0000" "this is a very good config"'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 60
            },
            args: [
                {
                    key: 'title',
                    prompt: 'What is the title of your config (example: config #0000?)',
                    type: 'string',
                    min: 4,
                    max: 50,
                    wait: 60
                },
                {
                    key: 'description',
                    prompt: 'Please provide a description of your config (who is it meant for and so on) **Max** 200 characters.',
                    type: 'string',
                    min: 10,
                    wait: 300
                }
            ],
            argsSingleQuotes: false,
        });
    }

    async run(msg, args) {
        let channel = msg.guild.settings.get('channel');
        if (!channel || !(channel = msg.guild.channels.get(channel))) {
            msg.react('❌');
            return msg.reply('Sorry, cant post configs right now.');
        }

        // Ok, we create the message
        const id = msg.guild.settings.get('next_id', 1);
        const formattedId = String(id).length >= 4 ? '' + id : (String('0').repeat(4) + id).slice(-4);

        const embed = new RichEmbed();
        embed.setAuthor(`Config id in discord #${formattedId}`, msg.guild.iconURL)
            .setColor('#0099ff')
            .addField('Title', args.title)
            .addField('Description', args.description)
            .setFooter(`Posted by ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
            .setTimestamp();

        // And send it
        const suggestion = await channel.sendEmbed(embed);
        suggestion.react('👍').then(() => suggestion.react('👎'));

        // Now, save the info that we want to keep
        msg.guild.settings.set(`config#${id}`, suggestion.id);
        msg.guild.settings.set('next_id', id + 1);

        // Now, we can confirm the actions
        if (!msg.promptCount) msg.react('✅');
        let reply = 'Your config is visible in the configs chat.';
        if (channel.permissionsFor(msg.member).hasPermission('READ_MESSAGES')) {
            reply += ` You can see it in ${channel} (ID #${formattedId}).`;
        }

        reply = await msg.reply(reply);

        // Due to a limitation in discord.js-commando, we can track all messages involved in the command
        // So, we delete messages, only if the command was run in a unique message
        if (!msg.promptCount && msg.deletable && reply.deletable) {
            msg.delete(305);
            reply.delete(305);
        }

        return reply;
    }
}

module.exports = AddCommand;