import {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} from "discord.js"
import getHive from "../api/hive.js"
import {
    gameName,
    gameEmoji,
    nto
} from "../data/hivecat.js"
import gameLevel from "../data/hivelevel.js"
const y = (t) => t.toString().replace(/&[0-9a-fklmnor]/gi, '');
const t = (s) =>
    s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());

function main(data, embed) {
    let desc = `
**Username**:
${data.username_cc}
**Rank**:
${data.rank}
**First Joined**:
<t:${data.first_played}:f>, <t:${data.first_played}:R>`;
    if ("equipped_avatar" in data) {
        embed.setThumbnail(data.equipped_avatar.url);
        desc += `\n**Equipped Avatar**:\n${data.equipped_avatar.name}`;
    };
    [
        "equipped_hub_title",
        "equipped_costume",
        "friend_count",
        "daily_login_streak",
        "longest_daily_login_streak",
        "hub_title_count",
        "avatar_count",
        "costume_count",
        "quest_count"
    ].forEach(e => {
        if (!(e in data)) return;
        let ton = (typeof data[e] === "string") ? `\n` : ` `;
        desc += `\n**${t(e)}**:${ton}${y(data[e])}`
    })
    embed.setDescription(desc)
}
export default {
    cooldown: 14,
    category: "Statistics",
    usage: {
        desc: "Shows HiveMC players' statistics, including statistics for every game"
    },
    data: new SlashCommandBuilder()
        .setName("hivemc")
        .setDescription("Shows HiveMC players' statistics, including statistics for every game")
        .addStringOption(option =>
            option.setName("username")
            .setDescription("XBOX Gamertag here")
            .setRequired(true)),
    execute: async (interaction, client) => {
        const {
            colors,
            norme
        } = client.config
        const username = interaction.options.getString("username")
        const hive = await getHive(username)
        if (!hive) return interaction.reply({
            embeds: [client.embErr("The user never join the server or the user never exist")],
            ephemeral: true
        });
        const data = hive.main
        let game = Object.entries(hive).filter(item => {
            return (Array.isArray(item[1]) && item[1].length > 0) || (typeof item[1] === 'object' && Object.keys(item[1]).length > 0) && (item[0] != "main");
        }).map(e => nto(e[0]));
        [
            "hub_title_unlocked",
            "avatar_unlocked",
            "costume_unlocked",
            "pets",
            "mounts",
            "hats",
            "backblings"
        ].forEach(e => {
            if (!(e in data)) return;
            if (data[e].length === 0) return;
            game.unshift({
                label: gameName.get(e),
                emoji: gameEmoji.get(e),
                value: `main-${e}`
            })
        })
        game.unshift({
            label: "Main Stats",
            emoji: "📊",
            value: "main"
        })
        const sel = new StringSelectMenuBuilder()
            .setCustomId(`hivemc-${interaction.user.id}-${username}`)
            .setPlaceholder("Choose other item/minigame data")
            .addOptions(game)
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "🐝 HiveMC Player Stats",
                iconURL: "https://cdn.discordapp.com/attachments/810008790492512256/1207251177494814770/image0.jpg"
            })
            .setTitle(`${data.username_cc}'s stats`)
            .setColor("#ffa600")
            .setFooter({
                text: norme.footer
            })
        main(data, embed)
        embed.addFields({
            name: "Collectibles 🥚",
            value: `
**Pets**: \`${data.pets.length}\`
**Mounts**: \`${data.mounts.length}\`
**Hats**: \`${data.hats.length}\`
**Backblings**: \`${data.backblings.length}\``
        })
        embed.addFields({
            name: "Identification 🪪",
            value: `
**UUID**: \`${data.UUID}\`
**XUID**: \`${data.xuid}\`
`
        })
        const act = new ActionRowBuilder().addComponents(sel)
        interaction.reply({
            embeds: [embed],
            components: [act]
        })
    },
    async selectmenu(interaction, client) {
        const {
            norme,
            colors
        } = client.config
        const [, userid, username] = interaction.customId.split("-")
        const embed = EmbedBuilder.from(interaction.message.embeds[0])
        if (interaction.user.id !== userid) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("This is not your HiveMC menu")
                    .setDescription(`Create your own using </skin:${client.slashId.get("hivemc")}>`)
                    .setColor(colors.error)
                    .setFooter({
                        text: norme.footer
                    })
                ],
                ephemeral: true
            })
        }
        let [game, item] = interaction.values[0].split("-")
        const data = await getHive(username, game)
        if (item) {
            let desc = `## ${gameName.get(item)} ${gameEmoji.get(item)}\n`
            switch (item) {
                case "hub_title_unlocked":
                    desc += data.hub_title_unlocked.map((e, i) => `${i+1}. ${y(e)}`).join(`\n`)
                    break;
                case "avatar_unlocked":
                    desc += data.avatar_unlocked.map((e, i) => `${i+1}. [${e.name}](${e.url})`).join(`\n`)
                    break;
                default:
                    desc += data[item].map((e, i) => `${i+1}. ${e}`).join(`\n`)
            }
            embed.setDescription(desc)
            interaction.update({
                embeds: [embed]
            })
            return;
        }

        if (game == "main") {
            main(data, embed);
            interaction.update({
                embeds: [embed]
            })
            return;
        }
        let fil = ["UUID", "xp", "played", "first_played", "rating_meh_received", "rating_okay_received", "rating_good_received", "rating_great_received", "rating_love_received"]
        let arr = Object.keys(data).filter(e => !fil.includes(e));
        let desc = `
## ${gameName.get(game)} ${gameEmoji.get(game)}
**Level**: \`${gameLevel(game, data.xp)}\`
**XP**: \`${data.xp}\`
**Played**:
\`${data.played} Times\`
**First Played**:
<t:${data.first_played}:f>, <t:${data.first_played}:R>
`
        const rating = r => {
            if (!(`rating_${r}_received` in data)) return 0;
            return data[`rating_${r}_received`]
        }
        if (game == "build") {
            desc += `### Rating Received
🔴 **Meh**: ${rating("meh")}
🟠 **Okay**: ${rating("okay")}
🟡 **Good**: ${rating("good")}
🟢 **Great**: ${rating("great")} 
❤️ **Love**: ${rating("love")}`
        }
        arr.forEach(e => {
            desc += `\n**${t(e)}**: \`${data[e]}\``
        })
        embed.setDescription(desc)
        interaction.update({
            embeds: [embed]
        })
    }
}