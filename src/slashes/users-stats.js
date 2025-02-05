import {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder
} from "discord.js"
import model from "../schema.js"
export default {
    cooldown: 10,
    menu: true,
    data: new ContextMenuCommandBuilder()
        .setName("Users Stats")
        .setType(ApplicationCommandType.User),
    execute: async (interact, { config: { norme, colors }, embErr, slashId }) => {
        const { id, bot, username } = interact.targetUser
        if (bot) {
            return interact.reply({
                embeds: [embErr("The user you picked cannot be a bot")],
                flags: 64
            })
        }
        let data = await model.findOne({ userid: id })
        if (!data) {
            data = await (new model({ userid: id })).save()
        }
        await interact.deferReply(data.private ? { flags: 64 } : {})
        if ((id !== interact.user.id) && data.private) return interact.editReply({
            embeds: [embErr("Data cannot be shown because the user toggle on the privacy")]
        });
        const filter = ["hangwin", "__v", "_id", "userid", "private", "access", "users-stats"]
        const array = [...Object.entries(data.toJSON())]
            .filter(e => !filter.includes(e[0]) && e[1] && e[0])
            .map(e => `</${e[0].replaceAll("-", " ")}:${slashId.get(e[0].split("-")[0])}> - ${e[1]}`)
            .join(`\n`);
        const embed = new EmbedBuilder()
            .setTitle(`${username}'s stats`)
            .setDescription(`
## Ban Status
${data.ban ? "Banned" : "Not Banned"}
## Command Stats
${array}
## Games
Hangman: ${data.hangwin} wins
## Context Menus
Users Stats: ${data["users-stats"]}
`)
            .setColor(colors.default)
            .setFooter({ text: norme.footer })
        interact.editReply({
            embeds: [embed]
        })
    }
}