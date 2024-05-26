import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js"
export default {
    dev: true,
    data: new SlashCommandBuilder()
        .setName("force")
        .setDescription("May 4th be with you")
        .addSubcommand(command =>
            command.setName("user")
                .setDescription("Restrict user from using Skin Stealer")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("Users ID of the target")
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName("guild")
                .setDescription("Force server to remove the bot")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("Server/Guild ID of the target")
                        .setRequired(true)
                )
        ),
    async execute(interact, { config: { colors, norme }, embErr, users, guilds }) {
        const id = interact.options.getString("id")
        const subcommand = interact.options.getSubcommand()
        if (subcommand === "user") {
            const user = await users.fetch(id)
            if (!user) return interact.reply({
                embeds: [embErr("This user did not exist/Your id may wrong")],
                ephemeral: true
            });
            const data = await data.findOne({ userid: interact.user.id })
            if (!data) {
                const newData = new model({ userid: id, ban: true })
                await newData.save()
                return;
            }
            await model.findOneAndUpdate({ userid: id }, { $set: { ban: !data.ban } }, { new: true })
            const fullName = `${user.username}(${id})`
            interact.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Ban Menu")
                    .setDescription(!data.ban ? `You banned ${fullName}` : `You unbanned ${fullName}`)
                    .setColor(colors.default)
                    .setFooter({ text: norme.footer })
                ]
            })
        }
        if (subcommand === "guild") {
            let guild;
            try {
                guild = guilds.cache.get(id)
            } catch (err) {
                guild = null
            }
            if (!guild) return interact.reply({
                embeds: [client.embErr("There could be two reason\n1. ID is not valid\n2. Server not found")],
                ephemeral: true
            });
            guild.leave().then(() => {
                interact.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Successfully Leave")
                        .setColor(colors.default)]
                })
            })
        }
    }
}