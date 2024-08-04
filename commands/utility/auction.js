const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ComponentType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auction')
    .setDescription('Auction options')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Enter the title of the bid.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('start_bid')
        .setDescription('Enter the starting bid and begin the auction.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('timer')
        .setDescription('Enter the length of the auction (in hours)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('URL of image')),
  async execute(interaction) {
    try {
      const allowedRoleId = ['1258791048520667267', '1251952830055710751'];
      const allowedChannelId = '1267046400043253773';

      if (interaction.channelId !== allowedChannelId) {
        await interaction.reply({ content: `Admin gang, use the <#1267046400043253773> channel, smh.`, ephemeral: true });
        return;
      }

      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!member.roles.cache.has(allowedRoleId[0]) && !member.roles.cache.has(allowedRoleId[1])) {
        await interaction.reply({ content: `You do not have the required role to use this command.`, ephemeral: true });
        return;
      }

      const title = interaction.options.getString("title");
      let startBid = Number(interaction.options.getString("start_bid"));
      const timerInput = Number(interaction.options.getString("timer"));
      const img = interaction.options.getString("image") || 'https://steamuserimages-a.akamaihd.net/ugc/2438207173318702003/C18C6B6482FC7CD550E9654CB7BA8B7260B06604/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false';

      if (isNaN(startBid) || startBid <= 0) {
        await interaction.reply({ content: `You've either put in a letter or a symbol`, ephemeral: true });
        return;
      }

      if (isNaN(timerInput) || timerInput < 1) {
        await interaction.reply({ content: `Make sure you didn't put a letter and the auction is at least an hour!`, ephemeral: true });
        return;
      }

      const timer = timerInput * 60 * 60 * 1000;
      let bidder = `Bid will start at ${startBid.toLocaleString()}`;
      let counter = 0;

      const auctionCreator = interaction.user.id;

      const increment_100000 = new ButtonBuilder()
        .setCustomId('100k')
        .setLabel('100,000 Nova Coin')
        .setStyle(ButtonStyle.Primary);

      const increment_250000 = new ButtonBuilder()
        .setCustomId('250k')
        .setLabel('250,000 Nova Coin')
        .setStyle(ButtonStyle.Primary);

      const increment_500000 = new ButtonBuilder()
        .setCustomId('500k')
        .setLabel('500,000 Nova Coin')
        .setStyle(ButtonStyle.Primary);

      const increment_1000000 = new ButtonBuilder()
        .setCustomId('1mil')
        .setLabel('1,000,000 Nova Coin')
        .setStyle(ButtonStyle.Primary);

      const deleteAuction = new ButtonBuilder()
        .setCustomId('delete')
        .setLabel('Delete Auction')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder()
        .addComponents(increment_100000, increment_250000, increment_500000, increment_1000000, deleteAuction);

      const createEmbed = (title, bidder, img) => new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(title)
        .setAuthor({
          name: "Winter Hideout Auctions",
        })
        .setDescription("Bid for some goodies? Will they be worth it or not?")
        .setThumbnail(
          "https://cdn.discordapp.com/icons/1189221028744925294/0865c8f3538102b29d6748e67e368687.webp"
        )
        .addFields({
          name: "Current Bid",
          value: `${bidder}`,
        })
        .setImage(`${img}`)
        .setTimestamp()
        .setFooter({
          text: "Brought to you by The Winter Hideout Team!",
          iconURL: "https://cdn.discordapp.com/icons/1189221028744925294/0865c8f3538102b29d6748e67e368687.webp",
        });

      const auctionEmbed = createEmbed(title, bidder, img);
      const response = await interaction.reply({ embeds: [auctionEmbed], components: [row] });

      const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button });

      let prev_user;

      const bidIncrements = {
        '100k': 100000,
        '250k': 250000,
        '500k': 500000,
        '1mil': 1000000
      };

      collector.on('collect', async i => {
        if (i.user.id === prev_user && i.customId !== 'delete') {
          await i.reply({ content: `Stop spamming it, dumbass!`, ephemeral: true });
          return;
        }

        if (i.customId in bidIncrements) {
          startBid += bidIncrements[i.customId];
          prev_user = i.user.id;
        } else if (i.customId === 'delete') {
          if (i.user.id !== auctionCreator && !member.roles.cache.some(role => allowedRoleId.includes(role.id))) {
            await i.reply({ content: `Only the auction creator or users with the specific role can delete the auction.`, ephemeral: true });
            return;
          }
          await i.deferUpdate();
          collector.stop('manual');
          return;
        }

        counter += 1;
        bidder = `${startBid.toLocaleString()} Nova Coins by <@${i.user.id}>`;
        const updatedEmbed = createEmbed(title, bidder, img);
        await i.update({ embeds: [updatedEmbed], components: [row] });

        console.log(i.customId);
        console.log(i.user.id);
        console.log(startBid);
        console.log(counter);
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'manual') {
          await response.delete();
          interaction.followUp({ content: 'Auction has been deleted.', ephemeral: true });
        } else {
          // Announce the winner
          const winnerEmbed = createEmbed(title, `Auction ended. Winner: ${bidder}`, img);
          await response.edit({ embeds: [winnerEmbed], components: [] });
          interaction.followUp({ content: `The auction has ended! Winner: ${bidder}` });
        }
      });

      setTimeout(() => {
        if (!collector.ended) {
          collector.stop('time');
        }
      }, timer);

    } catch (error) {
      console.error('Error executing the auction command:', error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  }
};
