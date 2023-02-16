const cooldowns = new Map()

const {
    Collection,
    EmbedBuilder,
    Events
} = require("discord.js")

const {
    colors,
    norme
} = require("../utils/config")

module.exports = {
    event: Events.InteractionCreate,
    run: async (interact, client) => {
        if (interact.isChatInputCommand()) {
            const slash = client.slashes.get(interact.commandName);
            if (!slash) return;
            let name = slash.data.name
            try {
                let subcommand = interact.options.getSubcommand()
                name += ` ${subcommand}`
            } catch (err) { }
            //Cooldown system
            if (slash.cooldown) {
                if (!cooldowns.has(slash.data.name)) {
                    cooldowns.set(slash.data.name, new Collection())
                }
                const current_time = Date.now();
                const time_stamps = cooldowns.get(slash.data.name);
                const cooldown_amount = (slash.cooldown) * 1000;
                if (time_stamps.has(interact.user.id)) {
                    const expiration_time = time_stamps.get(interact.user.id) + cooldown_amount;
                    if (current_time < expiration_time) {
                        const time_left = (expiration_time - current_time) / 1000;
                        const embed = new EmbedBuilder()
                            .setTitle("Cooldowns")
                            .setDescription(`Dude you are going too fast\nPlease wait ${time_left.toFixed(1)} more seconds before using </${name}:${slash.usage.id}>`)
                            .setFooter({
                                text: norme.footer
                            })
                            .setColor(colors.error)
                        return await interact.reply({
                            embeds: [embed],
                            ephemeral: true
                        });
                    }
                }
                time_stamps.set(interact.user.id, current_time);
                setTimeout(() => time_stamps.delete(interact.user.id), cooldown_amount);
            }
            //Ends of Slash command
            try {
                await slash.execute(interact, client);
            } catch (err) {
                if (err) console.log(err)
            }
        } else if (interact.isAutocomplete()) {
            const command = client.slashes.get(interact.commandName);
            if (!command) return;
            try {
                await command.autocomplete(interact, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interact.isButton()) {
            if (!interact.customId.startsWith("s")) return;
            const commandName = interact.customId.split("-")[1];
            const command = client.slashes.get(commandName);
            try {
                await command.button(interact, client);
            } catch (error) {
                console.log(error)
            }
        }
    }
}