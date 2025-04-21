import { getLeaderboard } from "../../api/hive.js"
import { gameName, gameEmoji } from "../../data/hivecat.js"
import {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} from "discord.js"
function s(num) {
    var s = num + "";
    while (s.length < 2) s = "0" + s;
    return s;
}
const urlFunc = (type, game, data, year) => {
    if (type === "alltime") return `https://playhive.com/leaderboard/all/${game}`
    if (type === "monthly") return `https://playhive.com/leaderboard/monthly/${game}/${year}/${s(data)}`
    if (type === "season") return `https://playhive.com/leaderboard/season/${game}/${data}`
}
export default {
    execute: async (interaction, client) => {
        const { colors, norme } = client.config
        await interaction.deferReply(client.checkPerms(interaction))
        const game = interaction.options.getString("game")
        const type = interaction.options.getSubcommand("type")
        const year = interaction.options.getString("year")
        const month = interaction.options.getString("month")
        const season = interaction.options.getString("season")
        const date = (type === "monthly") ? `${year}/${month}` : (type === "season") ? season : null;
        const leaderboard = await getLeaderboard(game, type, date)
        if (!leaderboard) return interaction.editReply({ embeds: [client.embErr("The leaderboard is not available")] })
        const linkButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("View Full Leaderboard")
                    .setStyle(ButtonStyle.Link)
                    .setURL(urlFunc(type, game, month || season, year))
                    .setEmoji("🐝")
            )
        const embed = new EmbedBuilder()
            .setTitle(`${gameName.get(game)} ${gameEmoji.get(game)} Leaderboard`)
            .setAuthor({ name: `HiveMC ${({ "alltime": "All Time", "monthly": "Monthly", "season": "Season" })[type]} Leaderboard`, iconURL: "https://playhive.com/content/images/size/w256h256/2021/11/favicontest.png" })
            .setColor(colors.default)
            .setDescription(`\`${leaderboard.map((e, i) => `${i + 1}. ${e}`).join("\n")}\``)
            .setFooter({ text: norme.footer })
            .setTimestamp()
        await interaction.editReply({ embeds: [embed], components: [linkButton] })
    }
}