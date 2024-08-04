const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore messages from bots
        if (message.author.bot) return;

        const helpCommands = {
            '.maplink': 'Placeholder info for maplink',
            '.base': 'Placeholder',
            '.flag': 'Craft 3 short sticks and rope together to create a TerritoryKit, you do not need all the materials as we\'ve got auto build enabled. Only a flag is needed after creating the TerritoryKit',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
            '.example': 'Placeholder',
        };


        for (const [command, response] of Object.entries(helpCommands)) {
            if (message.content.toLowerCase().includes(command)) {

                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setDescription(response);

                await message.reply({ embeds: [embed] });
                break;
            }
        }
    },
};