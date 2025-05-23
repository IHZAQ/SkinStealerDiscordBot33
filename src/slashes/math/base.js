import {
    EmbedBuilder
} from "discord.js"
export default async (interaction, { embErr, config: { norme, colors }, checkPerms }) => {
    const num1 = interaction.options.getString("num1").toUpperCase()
    if (!(/^[A-Z0-9]+$/.test(num1))) {
        interaction.reply({
            embeds: [embErr("You can only put numbers and letters\nAlso please refrain from using decimals")],
            flags: 64
        })
        return;
    }
    const base1 = interaction.options.getInteger("base1")
    let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    arr.splice(0, base1)
    const check = (str) => !arr.some(char => str.includes(char));
    if (!check(num1)) {
        interaction.reply({
            embeds: [embErr(`The Number ${num1} is not in Base ${base1}`)],
            flags: 64
        })
        return;
    }
    const base2 = interaction.options.getInteger("base2")
    const changed = parseInt(num1, base1).toString(base2).toUpperCase();
    const embed = new EmbedBuilder()
        .setTitle("Base Converter")
        .addFields({
            name: "Given Number",
            value: `${num1} (Base ${base1})`
        },
            {
                name: "Converted Number",
                value: `${changed} (Base ${base2})`
            })
        .setFooter({ text: norme.footer })
        .setColor(colors.default)
    let content = {
        embeds: [embed]
    }
    if (!checkPerms(interaction, true)) content.flags = 64;
    interaction.reply(content)
}