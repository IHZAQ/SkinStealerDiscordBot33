import {
    EmbedBuilder
} from "discord.js"
const at = (num) => (a === 1) ? "" : a;
export default async (interact, { config: { norme, colors }, embErr }) => {
    const a = interact.options.getNumber("a")
    const b = interact.options.getNumber("b")
    const c = interact.options.getNumber("c")
    if (a == 0) {
        await interact.reply({
            embeds: [embErr("Get back to school kiddo, A value cannot be zero")],
            ephemeral: true
        })
    }
    const pembezalayan = (b ** 2) - (4 * a * c);
    if (pembezalayan < 0) {
        await interact.reply({
            embeds: [embErr("Math Error, you got [imaginary](https://www.google.com/search?q=imaginary+roots+of+quadratic+equation) number")],
            ephemeral: true
        })
        return;
    }
    const pembeza = (Math.sqrt(pembezalayan)) / (2 * a);
    const sim = -b / (2 * a);
    const x1 = sim + pembeza;
    const x2 = sim - pembeza;
    const embed = new EmbedBuilder()
        .setTitle("EQN Quadratic Solver")
        .setDescription(`
**Your Equation**:
${at(a)}**X²** ${at((b > 0) ? `+ ${b}` : `- ${-b}`)}**X** ${(c > 0) ? `+ ${c}` : `- ${-c}`} = 0
**X's Value**:
X1 ${Number.isInteger(x1) ? "=" : "≈"} ${x1}
X2 ${Number.isInteger(x2) ? "=" : "≈"} ${x2}
`)
        .setColor(colors.default)
        .setFooter({ text: norme.footer });
    await interact.reply({
        embeds: [embed]
    })
}