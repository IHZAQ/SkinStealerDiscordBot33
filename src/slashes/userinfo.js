import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";
import emojiData from "../data/bedji.js";
export default {
    cooldown: 10,
    category: "Fun / Utilities",
    usage: {
        desc: "Get Discord user info"
    },
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get Discord user info")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Choose your user (Primary over id)")
        )
        .addStringOption(option =>
            option.setName("id")
                .setDescription("Put the user id")
        )
        .setIntegrationTypes([0, 1]),
    execute: async (interaction, { embErr, config: { norme, colors }, users }) => {
        const idOption = interaction.options.getString("id");
        const userOption = interaction.options.getUser("user");
        const userFromId = idOption ? (await users.fetch(idOption).catch(err => { })) : undefined;
        if (idOption && !userFromId && !userOption) {
            return interaction.reply({
                embeds: [embErr("The user id that provided")],
                flags: 64
            })
        }
        await interaction.deferReply();
        const user = interaction.options.getUser("user") || userFromId || (await users.fetch(interaction.user.id));
        const banner = user.bannerURL()
        const unix = parseInt((new Date(user.createdTimestamp).getTime() / 1000).toFixed(0))
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🚹")
                    .setLabel("User Profile")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`discord://-/users/${user.id}`)
            )
        const embed = new EmbedBuilder()
            .setTitle(`${user.globalName}${(user.discriminator !== "0") ? `#${user.discriminator}` : ""} (@${user.username.toLowerCase()})`)
            .setFooter({ text: norme.footer })
            .setThumbnail(user.avatarURL())
            .setColor(colors.default)
            .setAuthor({ name: "Discord User Info" });
        let description = `
**ID**: **\`${user.id}\`**
**Username**: **\`${user.username}\`**
**Badges**: ${user.flags.toArray().map(e => emojiData.get(e))}
**Joined Date**: <t:${unix}:D>, <t:${unix}:R>
**Download**: [Avatar](${user.avatarURL()})`
        if (banner) {
            embed.setImage(banner)
            description += ` [Banner](${banner})`
        }
        if (user.accentColor) {
            description += `\n**Banner Color**: **\`${user.accentColor}\`**`;
        }
        embed.setDescription(description)
        await interaction.editReply({
            embeds: [embed],
            components: [row]
        })
    }
}