import {
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} from "discord.js"
import {
    gameName,
    gameEmoji,
    nto
} from "../../data/hivecat.js"
import { getHive } from "../../api/hive.js"
import gameLevel from "../../data/hivelevel.js"
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
function gameThing(data, game, embed) {
    let fil = ["UUID", "xp", "played", "parkours", "first_played", "rating_meh_received", "rating_okay_received", "rating_good_received", "rating_great_received", "rating_love_received"]
    let arr = Object.keys(data).filter(e => !fil.includes(e));
    let desc = `## ${gameName.get(game)} ${gameEmoji.get(game)}`
    if (data.xp) desc += `\n**Level**: \`${gameLevel(game.split("-")[0], (data.xp || 0))}\``
    if (data.xp) desc += `\n**XP**: \`${data.xp || 0}\``
    if (data.played) desc += `\n**Played**:\n\`${data.played || 0} Times\``
    if (data.first_played) desc += `\n**First Played**:\n<t:${data.first_played}:f>, <t:${data.first_played}:R>`
    if (game == "parkour") {
        desc += `
    Total Stars Collected: \`${data.parkours.total_stars}/400\`
    `
    }
    if (game == "build") {
        const rating = r => (`rating_${r}_received` in data) ? data[`rating_${r}_received`] : 0;
        desc += `\n### Rating Received
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
}
export default {
    execute: async (interaction, client) => {
        const {
            norme
        } = client.config

        const username = interaction.options.getString("username")
        const gameOption = interaction.options.getString("game")
        const api = await getHive(username, gameOption);
        if (!api) return interaction.reply({
            embeds: [client.embErr(`
These could be the reason
- The user never join the server
- The user never exist
- The user has no data in this game
- If you think this is a mistake, 
the main leaderboard data could probably be missing
and try again </hivemc player:${client.slashId.get("hivemc")}> with game option
- If still not working, hivemc api is probably down
`)],
            flags: 64
        });
        const { isAvailable, isMain } = api;
        const hive = api.data;
        await interaction.deferReply(client.checkPerms(interaction))
        const mainData = hive?.main
        const data = hive[gameOption || "main"];
        let userItem = ["hub_title_unlocked", "avatar_unlocked", "costume_unlocked", "pets", "mounts", "hats", "backblings"]
        let game;
        if (!isAvailable) game = [...gameName.entries()].filter(e => !userItem.includes(e[0])).map((e, i) => {
            return {
                label: e[1],
                emoji: gameEmoji.get(e[0]),
                value: e[0]
            }
        });
        else game = Object.entries(hive).filter(item => { return (Array.isArray(item[1]) && item[1].length > 0) || (typeof item[1] === 'object' && Object.keys(item[1]).length > 0) && (item[0] != "main"); }).map(e => nto(e[0]));
        if (isMain) {
            userItem.forEach(e => {
                if (!(e in data)) return;
                if (data[e].length === 0) return;
                game.unshift({
                    label: gameName.get(e),
                    emoji: gameEmoji.get(e),
                    value: `main~${e}`
                })
            });
            game.unshift({
                label: "Main Stats",
                emoji: "📊",
                value: "main"
            })
        }
        const sel = new StringSelectMenuBuilder()
            .setCustomId(`hivemc-${interaction.user.id}-${username}-player`)
            .setPlaceholder("Choose other item/minigame data")
            .addOptions(game)
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "HiveMC Player Stats",
                iconURL: "https://playhive.com/content/images/size/w256h256/2021/11/favicontest.png"
            })
            .setTitle(`${mainData?.username_cc || username}'s stats`)
            .setColor("#ffa600")
            .setFooter({
                text: norme.footer
            })
        if (isMain && !gameOption) main(data, embed);
        else gameThing(data, gameOption || "main", embed);
        const collLn = e => (e in data) ? data[e].length : 0;
        embed.addFields({
            name: "Collectibles 🥚",
            value: `
    **Pets**: \`${collLn("pets")}\`
    **Mounts**: \`${collLn("mounts")}\`
    **Hats**: \`${collLn("hats")}\`
    **Backblings**: \`${collLn("backblings")}\``
        })
        embed.addFields({
            name: "Identification 🪪",
            value: `
    **UUID**: \`${mainData?.UUID || data.UUID || "Unknown"}\`
    **XUID**: \`${mainData?.xuid || "Unknown"}\`
    `
        })
        const act = new ActionRowBuilder().addComponents(sel)
        interaction.editReply({
            embeds: [embed],
            components: [act]
        })
    },
    selectmenu: async (interaction, client) => {
        const [, userid, username] = interaction.customId.split("-")
        const { norme, colors } = client.config
        const embed = EmbedBuilder.from(interaction.message.embeds[0])
        if (interaction.user.id !== userid) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("This is not your HiveMC menu")
                    .setDescription(`Create your own using </hivemc:${client.slashId.get("hivemc")}>`)
                    .setColor(colors.error)
                    .setFooter({ text: norme.footer })
                ],
                flags: 64
            })
        }
        let [game, item] = interaction.values[0].split("~")
        const api = await getHive(username, game)
        if (!api) return interaction.reply({
            embeds: [client.embErr("The user never play the game or data is not available")],
            flags: 64
        })
        const data = api.data[game];
        if (item) {
            let desc = `## ${gameName.get(item)} ${gameEmoji.get(item)}\n`
            if (item in data) {
                const dataList = item === "hub_title_unlocked" ? data.hub_title_unlocked : data[item];
                desc += dataList.map((e, i) => `${i + 1}. ${item === "avatar_unlocked" ? e.name : y(e)}`).join(`\n`);
            } else {
                desc += "`Missing Data`"
            }
            embed.setDescription(desc)
            interaction.update({
                embeds: [embed]
            })
            return;
        }

        if (game == "main") {
            main(data, embed);
            interaction.update({ embeds: [embed] })
            return;
        }
        gameThing(data, game, embed)
        interaction.update({
            embeds: [embed]
        })
    }
}