import { EmbedBuilder } from "discord.js"
export default async (files, client) => {
  const { colors, norme } = client.config
  client.embErr = (desc) => {
    return new EmbedBuilder()
     .setTitle("Error Occurred")
     .setDescription(desc)
     .setColor(colors.error)
     .setFooter({ text: norme.footer })
  }
  for (const file of files) {
   const slash = (await import(`../slashes/${file}`)).default
   if(!slash.dev){
      client.slashArray.push(slash.data.toJSON())
      client.slash.set(slash.data.name, slash)
    } else {
      client.slashDevArray.push(slash.data.toJSON())
      client.slashDev.set(slash.data.name, slash)
    }
  }
}