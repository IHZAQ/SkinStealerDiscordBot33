import {
    EmbedBuilder
} from "discord.js"
const at = (num) => (num === 1) ? "" : num;
export default async (interact, { config: { norme, colors }, embErr }) => {
    const a = interact.options.getNumber("a")
    const b = interact.options.getNumber("b")
    const c = interact.options.getNumber("c")
    const fr = interact.options.getString("fraction") || false
    const dcf = (decimal) => {
        const decimalString = decimal.toString();
        const [integerPart, decimalPart] = decimalString.split('.');
        const threePart = (fr === "abc");
        if (!decimalPart && !threePart) return integerPart;
        const denominator = Math.pow(10, decimalPart.length);
        const decimalInteger = parseInt(decimalPart, 10);
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const divisor = gcd(decimalInteger, denominator);
        const simplifiedNumerator = decimalInteger / divisor;
        const simplifiedDenominator = denominator / divisor;
        const output = threePart && simplifiedNumerator >= simplifiedDenominator
            ? [integerPart, simplifiedNumerator, simplifiedDenominator]
            : [integerPart * simplifiedDenominator + simplifiedNumerator, simplifiedDenominator];
        return output.join("/");
    };
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
    const cx = -b / (2 * a);
    const x1 = cx + pembeza;
    const x2 = cx - pembeza;
    const cy = -(b ** b) / (4 * a) + c;
    const embed = new EmbedBuilder()
        .setTitle("EQN Quadratic Solver")
        .setDescription(`
**Your Equation**:
${at(a)}**X²** ${at((b > 0) ? `+ ${b}` : `- ${-b}`)}**X** ${(c > 0) ? `+ ${c}` : `- ${-c}`} = 0
**X's Value**:
X${pembezalayan == 0 ? "" : "¹"} ${Number.isInteger(x1) ? "=" : "≈"} ${dcf(x1)}
${pembezalayan == 0 ? "" : `X² ${Number.isInteger(x2) ? "=" : "≈"} ${dcf(x2)}`}
**${a > 0 ? "Minimum " : "Maximum"} coordinates**:
(${dcf(cx)}, ${dcf(cy)})
`)
        .setColor(colors.default)
        .setFooter({ text: norme.footer });
    await interact.reply({
        embeds: [embed]
    })
}