import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js"

export default {
  dev: true,
  data: new SlashCommandBuilder()
    .setName("leftserver")
    .setDescription("Force a bot to left a server with its id")
    .addStringOption(option =>
         option.setName("id")
           .setDescription("Server Id")
           .setRequired(true)), 
  execute: async (interaction, client) => {
    const { norme, colors } = client.config
    let guildid = interaction.options.getString("id")
    let guild;
    try { 
      guild = client.guilds.cache.get(guildid)
    } catch (err) {
      guild = null
    }
    const embed = new EmbedBuilder
    if (!guild) return interaction.reply({
      embeds: [new EmbedBuilder() 
      .setTitle("Error")
      .setDescription("There could be two reason\n1. ID is not valid\n2. Server not found")
      .setColor(colors.error)], 
      ephemeral: true
    });
    guild.leave().then(() => {
      interaction.reply({
        embeds: [new EmbedBuilder()
        .setTitle("Successfully Leave")
        .setColor(colors.default)]
      })
    })
  }
}