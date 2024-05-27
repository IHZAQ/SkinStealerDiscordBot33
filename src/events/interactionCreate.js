const cooldowns = new Map()
import model from "../schema.js"

import {
  Collection,
  EmbedBuilder,
  Events,
  PermissionsBitField
} from "discord.js"

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
      ephemeral: true
    }
    if (interact.isChatInputCommand()) {
      let slash = client.slash.get(interact.commandName);
      if (!slash) {
        if (!developers.includes(interact.user.id)) return interact.reply(noperms);
        const slash2 = client.slashDev.get(interact.commandName)
        if (!slash2) return;
        slash = slash2
      }
      let name = slash.data.name
      try {
        let subcommand = interact.options.getSubcommand()
        name += ` ${subcommand}`
      } catch (err) { }
      const data = await model.findOne({ userid: interact.user.id });
      if(data && data.ban) return interact.reply({
        embeds: [client.embErr("You are banned from using Skin Stealer bot\nPlease join [our server](https://discord.gg/3d3HBTvfaT) to request for unban")],
        ephemeral: true
      })
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
              .setDescription(`Dude you are going too fast\nPlease wait ${time_left.toFixed(1)} more seconds before using </${name}:${client.slashId.get(interact.commandName)}>`)
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
        const newName = name.replace(" ", "-")
        if(!data) {
          let newData = new model({ userid: interact.user.id, [newName]: 1 })
          await newData.save()
        } else {
          await model.findOneAndUpdate({ userid: interact.user.id }, { $set: { [newName]: (data[newName] + 1) } }, { new: true } )
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
      return;
    }
    if (interact.isAutocomplete()) {
      const command = client.slash.get(interact.commandName);
      if (!command) return;
      try {
        await command.autocomplete(interact, client);
      } catch (error) {
        if(error) console.error(error);
      }
      return;
    }
    if (interact.isButton()) {
      const main = interact.customId.split("-")
      if (main[0] !== "s") return;
      const command = client.slash.get(main[1]);
      try {
        await command.button(interact, client);
      } catch (error) {
        if(error) console.log(error)
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
      const command = client.slash.get(commandName)
      try {
        await command.modal(interact, client)
      } catch (error) {
        if (error) console.log(error)
      }
      return;
    }
  }
}