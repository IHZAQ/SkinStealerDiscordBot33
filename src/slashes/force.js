import {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js"
import model from "../schema.js"
export default {
    dev: true,
    data: new SlashCommandBuilder()
        .setName("force")
        .setDescription("May 4th be with you")
        .addSubcommand(command =>
            command.setName("userban")
                .setDescription("Restrict user from using Skin Stealer")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("Users ID of the target")
                        .setRequired(true)
                )
        )
        .addSubcommand(command =>
            command.setName("userdelete")
                .setDescription("Delete user data from Skin Stealer")
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
        const text = ({
            userban: "to ban this user",
            userdelete: "to delete this user data",
            guild: "to force Skin Stealer leave this server"
        })[subcommand]
        let embed;
        if (subcommand === "userban" || subcommand === "userdelete") {
            const user = await users.fetch(id).catch(() => { })
            if (!user) return interact.reply({
                embeds: [embErr("This user did not exist/Your id may wrong")],
                flags: 64
            });
            embed = new EmbedBuilder()
                .setTitle("Force Menu")
                .setDescription(`You are about to ${text}\nUser: **${user.username}(${id})**`)
                .setThumbnail(user.displayAvatarURL({ size: 512, extension: "png" }))
                .setColor(colors.default)
                .setFooter({ text: norme.footer })
        }
        if (subcommand === "guild") {
            let guild;
            try {
                guild = guilds.cache.get(id)
            } catch (err) {
                guild = null
            }
            if (!guild) return interact.reply({
                embeds: [embErr("There could be two reason\n1. ID is not valid\n2. Server not found")],
                flags: 64
            });
            embed = new EmbedBuilder()
                .setTitle("Force Menu")
                .setDescription(`You are about to ${text}\nServer: **${guild.name}(${id})**`)
                .setThumbnail(guild.iconURL({ size: 512, extension: "png" }))
                .setColor(colors.default)
                .setFooter({ text: norme.footer })
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`s-force-${subcommand}-${id}`)
                    .setLabel(`Are you sure ${text}?`)
                    .setStyle(ButtonStyle.Danger)
            )
        await interact.reply({
            embeds: [embed],
            components: [row],
            flags: 64
        })
    },
    async button(interact, { config: { colors, norme }, embErr, users, guilds }) {
        const [, , subcommand, id] = interact.customId.split("-")
        if (subcommand === "userban") {
            const data = await model.findOne({ userid: id });
            await model.findOneAndUpdate({ userid: id }, { $set: { ban: !data.ban, access: false } }, { returnDocument: 'after' });
            const user = await users.fetch(id).catch(() => { });
            const fullName = `${user.username}(${id})`;
            await interact.update({
                embeds: [new EmbedBuilder()
                    .setTitle("Ban Menu")
                    .setDescription(!data.ban ? `You banned ${fullName}` : `You unbanned ${fullName}`)
                    .setColor(colors.default)
                    .setFooter({ text: norme.footer })
                ],
                components: []
            });
        }
        if (subcommand === "userdelete") {
            await model.findOneAndDelete({ userid: id });
            const user = await users.fetch(id).catch(() => { });
            await interact.update({
                embeds: [new EmbedBuilder()
                    .setTitle("Delete Menu")
                    .setDescription(`You deleted data of ${user.username}(${id})`)
                    .setColor(colors.default)
                    .setFooter({ text: norme.footer })
                ],
                components: []
            });
        }
        if (subcommand === "guild") {
            const guild = guilds.cache.get(id)
            guild.leave().then(() => {
                interact.update({
                    embeds: [new EmbedBuilder()
                        .setTitle("Successfully Leave")
                        .setColor(colors.default)
                        .setDescription(`Skin Stealer has left the server **${guild.name}(${id})**`)
                        .setFooter({ text: norme.footer })],
                    components: []
                })
            })
        }
    }
}