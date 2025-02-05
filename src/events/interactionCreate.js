const cooldowns = new Map()
import model from "../schema.js"

import {
  Collection,
  EmbedBuilder,
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from "discord.js"

const t = (s) => s.replace(/\s+/g, ' ').toLowerCase();

export default {
  event: Events.InteractionCreate,
  run: async (interact, client) => {
    const {
      norme,
      colors,
      developers
    } = client.config
    const noperms = {
      embeds: [new EmbedBuilder()
        .setTitle("Missing Permission")
        .setDescription("Only Owner and Developers had permission to use this commands")
        .setColor(colors.error)],
      flags: 64
    }
    if (interact.isChatInputCommand() || interact.isUserContextMenuCommand()) {
      let data = await model.findOne({ userid: interact.user.id });
      if (!data) {
        data = await (new model({ userid: interact.user.id })).save()
      }
      if (!data.access) {
        const embed = new EmbedBuilder()
          .setTitle("Welcome to Skin Stealer!")
          .setDescription(`To get started, please review and accept our [Privacy Policy](https://github.com/IHZAQ/SkinStealerDiscordBot33/blob/main/PRIVACY-POLICY.md) and [Terms of Service](https://github.com/IHZAQ/SkinStealerDiscordBot33/blob/main/TOS.md) to continue.`)
          .setColor(colors.default)
          .setFooter({ text: norme.footer });
        const button = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`access-${interact.user.id}`)
              .setLabel("Reviewed and Accepted")
              .setEmoji("✅")
              .setStyle(ButtonStyle.Primary)
          );
        await interact.reply({
          embeds: [embed],
          components: [button],
          flags: 64
        })
        return;
      }
      if (data && data.ban) return interact.reply({
        embeds: [client.embErr("You are banned from using Skin Stealer bot\nPlease join [our server](https://discord.gg/3d3HBTvfaT) to request for unban")],
        flags: 64
      });
      let slash = client.slash.get(interact.commandName);
      if (!slash) {
        if (!developers.includes(interact.user.id)) return interact.reply(noperms);
        const slash2 = client.slashDev.get(interact.commandName)
        if (!slash2) return;
        slash = slash2
      }
      let name = slash.menu ? t(slash.data.name) : slash.data.name;
      const subgroup = interact.options.getSubcommandGroup(false)
      const subcommand = interact.options.getSubcommand(false)
      name += subgroup ? ` ${subgroup}` : "";
      name += subcommand ? ` ${subcommand}` : "";
      //Cooldown system
      if (slash.cooldown) {
        if (!cooldowns.has(name)) {
          cooldowns.set(name, new Collection())
        }
        const current_time = Date.now();
        const time_stamps = cooldowns.get(name);
        const cooldown_amount = (slash.cooldown) * 1000;
        if (time_stamps.has(interact.user.id)) {
          const expiration_time = time_stamps.get(interact.user.id) + cooldown_amount;
          if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            const embed = new EmbedBuilder()
              .setTitle("Cooldowns")
              .setDescription(`Dude you are going too fast\nPlease wait ${time_left.toFixed(1)} more seconds before using ${slash.menu ? `context menu ${slash.data.name}` : `</${name}:${client.slashId.get(interact.commandName)}>`}`)
              .setFooter({
                text: norme.footer
              })
              .setColor(colors.error)
            return await interact.reply({
              embeds: [embed],
              flags: 64
            });
          }
        }
        const newName = name.replaceAll(" ", "-")
        await model.findOneAndUpdate({ userid: interact.user.id }, { [newName]: (data[newName] + 1) })
        time_stamps.set(interact.user.id, current_time);
        setTimeout(() => time_stamps.delete(interact.user.id), cooldown_amount);
      } else {
        const newName = name.replaceAll(" ", "-")
        await model.findOneAndUpdate({ userid: interact.user.id }, { [newName]: (data[newName] + 1) })
      }
      //Ends of Slash command
      try {
        await slash.execute(interact, client);
      } catch (err) {
        if (err) console.log(err)
      }
      return;
    }
    if (interact.isAutocomplete()) {
      const command = client.slash.get(interact.commandName);
      if (!command) return;
      try {
        await command.autocomplete(interact, client);
      } catch (error) {
        if (error) console.error(error);
      }
      return;
    }
    if (interact.isButton()) {
      const main = interact.customId.split("-")
      if (main[0] === "access") {
        await model.findOneAndUpdate({ userid: main[1] }, { $set: { access: true } }, { new: true })
        await interact.update({
          embeds: [EmbedBuilder.from(interact.message.embeds[0]).setDescription("Thank you for accepting the Privacy Policy and Terms of Service! You’re all set to start using Skin Stealer. Enjoy your experience!")],
          components: []
        })
        return;
      }
      if (main[0] !== "s") return;
      const command = client.slash.get(main[1]);
      try {
        await command.button(interact, client);
      } catch (error) {
        if (error) console.log(error)
      }
      return;
    }
    if (interact.isStringSelectMenu()) {
      const commandName = interact.customId.split("-")[0]
      const command = client.slash.get(commandName)
      try {
        await command.selectmenu(interact, client)
      } catch (error) {
        if (error) console.log(error)
      }
      return;
    }
    if (interact.isModalSubmit()) {
      const commandName = interact.customId.split("-")[0]
      const command = client.slash.get(commandName) || client.slashDev.get(commandName);
      try {
        await command.modal(interact, client)
      } catch (error) {
        if (error) console.log(error)
      }
      return;
    }
  }
}