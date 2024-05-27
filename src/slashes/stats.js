import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js"
import model from "../schema.js"

export default {
    cooldown: 10,
    category: "Statistics",
    usage: {
        user: "Showing stats of how many times the user use the bot",
        privacy: "Toggle on/off your privacy"
    },
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("stats")
        .addSubcommand(command =>
            command.setName("user")
                .setDescription("Showing stats of how many times you use the bot")
                .addUserOption(option =>
                    option.setName("target")
                        .setDescription("The stats of other user")
                )
                .addBooleanOption(option => 
                    option.setName("hide")
                        .setDescription("You want this stats visible or not")
                )
        )
        .addSubcommand(command =>
            command.setName("privacy")
                .setDescription("Toggle on/off your privacy")
                .addBooleanOption(option =>
                    option.setName("toggle")
                        .setDescription("decision")
                        .setRequired(true)
                )
        ),
    async execute(interact, { slashId, embErr, config: { colors, norme } }) {
        const subcommand = interact.options.getSubcommand()
        if (subcommand === "user") {
            const { id, username, bot } = interact.options.getUser("target") || interact.user;
            if (bot) return interact.reply({
                embeds: [embErr("The user you picked cannot be a bot")],
                ephemeral: true
            });
            const hide = interact.options.getBoolean("hide") || false;
            const data = await model.findOne({ userid: id })
            await interact.deferReply({ ephemeral: (data.private || hide) })
            if ((id !== interact.user.id) && data.private) return interact.editReply({
                embeds: [embErr("Data cannot be shown because the user toggle on the privacy")]
            });
            const filter = ["hangwin", "__v", "_id", "userid", "private"]
            const array = [...Object.entries(data.toJSON())]
                .filter(e => !filter.includes(e[0]) && e[1] )
                .map(e => `</${e[0].replace("-", " ")}:${slashId.get(e[0].split("-")[0])}> - ${e[1]}`)
                .join(`\n`);
            const embed = new EmbedBuilder()
                .setTitle(`${username}'s stats`)
                .setDescription(`
## Ban Status
${data.ban ? "Banned": "Not Banned"}
## Command Stats
${array}
## Games
Hangman: ${data.hangwin} wins
`)
                .setColor(colors.default)
                .setFooter({ text: norme.footer })
            interact.editReply({
                embeds: [embed]
            })
        } else {
            await interact.deferReply({ ephemeral: true })
            const boolean = interact.options.getBoolean("toggle")
            await model.findOneAndUpdate({ userid: interact.user.id }, { $set: { private: boolean } }, { new: true } )
            interact.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("Data Privacy")
                    .setDescription(boolean ? "Your stats data has been protected.\nWhich means people cannot see your stats" : "Your stats now can been seen by other user")
                    .setColor(colors.default)
                    .setFooter({ text: norme.footer })
                ],
            })
        }
    }
}