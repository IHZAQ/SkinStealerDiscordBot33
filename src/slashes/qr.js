import {
	toDataURL
} from "qrcode"
import {
	SlashCommandBuilder,
	EmbedBuilder,
	AttachmentBuilder
} from "discord.js"
export default {
	cooldown: 10,
	category: "General",
	usage: {
		desc: "Turn URL/Text into QR Code"
	},
	data: new SlashCommandBuilder()
		.setName("qr")
		.setDescription("Turn URL/Text into QR Code")
		.addStringOption(option =>
			option.setName("prompt")
			.setDescription("Put URL or Text")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("light")
			.setDescription("Set Custom Color for Light Area")
			.setMinLength(6)
			.setMaxLength(6))
		.addStringOption(option =>
			option.setName("dark")
			.setDescription("Set Custom Color for Dark Area")
			.setMinLength(6)
			.setMaxLength(6)),
	execute: async (interaction, {
		embErr,
		config: {
			norme,
			colors
		}
	}) => {
		const prompt = interaction.options.getString("prompt")
		const light = interaction.options.getString("light")
		const dark = interaction.options.getString("dark");
		const qr = await toDataURL(prompt, {
			color: {
				light: `${light || "ffffff"}ff`,
				dark: `${dark || "000000"}ff`
			}
		}).catch(err => {})
		if (!qr) return interaction.reply({
			embeds: [embErr(`A QR Code Cannot be generated due to unknown reason.\nIf you think this is mistake please report using </reportbug:${client.slashId.get("reportbug")}> commands`)],
			ephemeral: true
		});
		const img = new Buffer.from(qr.split(",")[1], "base64");
		const attach = new AttachmentBuilder(await img, {
			name: "qr.png"
		})
		const embed = new EmbedBuilder()
			.setTitle("QR Code Generator")
			.setDescription(`Prompts:
\`${prompt}\``)
			.setImage("attachment://qr.png")
			.setFooter({
				text: norme.footer
			})
			.setColor(colors.default)
		interaction.reply({
			embeds: [embed],
			files: [attach]
		})
	}
}