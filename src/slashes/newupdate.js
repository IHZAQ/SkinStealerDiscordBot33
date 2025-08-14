import {
    SlashCommandBuilder,
    EmbedBuilder
} from 'discord.js';
import model from "../schema.js";
export default {
    dev: true,
    data: new SlashCommandBuilder()
        .setName('newupdate')
        .setDescription('Create a notification for a new update')
        .addBooleanOption(option =>
            option.setName('seenews')
                .setDescription('The value of seenews')),
    async execute(interact, client) {
        const seenewsvalue = interact.options.getBoolean('seenews') || false; 
        await model.updateMany(
            { seenews: { $exists: true } },
            { $set: { seenews: seenewsvalue } }
        );
        const { config: { norme, colors } } = client;
        const embed = new EmbedBuilder()
            .setTitle('New Update Available!')
            .setDescription('A new update has been released. Please check the updates channel for more information.')
            .setColor(colors.default)
            .setFooter({ text: norme.footer })
            .setTimestamp();
        await interact.reply({ embeds: [embed], flags: 64 });
    }
}