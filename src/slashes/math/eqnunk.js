import {
    EmbedBuilder
} from "discord.js"
export default async (interact, {
    config: {
        colors,
        norme
    },
    embErr
}) => {
    const data = {
        a1: interact.options.getNumber("a1"),
        b1: interact.options.getNumber("b1"),
        c1: interact.options.getNumber("c1"),
        d1: interact.options.getNumber("d1"),
        a2: interact.options.getNumber("a2"),
        b2: interact.options.getNumber("b2"),
        c2: interact.options.getNumber("c2"),
        d2: interact.options.getNumber("d2"),
        a3: interact.options.getNumber("a3"),
        b3: interact.options.getNumber("b3"),
        c3: interact.options.getNumber("c3"),
        d3: interact.options.getNumber("d3")
    }
    const fr = interact.options.getString("fraction") || false
    const dcf = (decima) => {
        let decimal = Math.abs(decima)
        const neg = (decima != decimal) ? "-" : "";
        if (!fr) return decimal;
        if (typeof decimal !== "number" || isNaN(decimal)) return null;
        const [integerPart, decimalPart] = decimal.toString()
            .split(".");
        if (!decimalPart) return integerPart;

        const denominator = 10 ** decimalPart.length;
        const numerator = parseInt(decimalPart, 10);

        const gcd = (a, b) => (b ? gcd(b, a % b) : a);
        const divisor = gcd(numerator, denominator);

        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;

        if (decimal < 1 || fr === "ab") {
            return decimal < 1 ?
                `${neg}${simplifiedNumerator}/${simplifiedDenominator}` :
                `${neg}${integerPart * simplifiedDenominator + simplifiedNumerator}/${simplifiedDenominator}`;
        }
        return `${neg}${integerPart}/${simplifiedNumerator}/${simplifiedDenominator}`;
    };
    const subt = (str) => {
        return ((data[str[0] + str[2]] * data[str[1] + str[3]]) - (data[str[0] + str[3]] * data[str[1] + str[2]]))
    }
    const embed = new EmbedBuilder()
        .setFooter({
            text: norme.footer
        })
        .setColor(colors.default);
    const {
        a1,
        b1,
        c1,
        a2,
        b2,
        c2
    } = data;
    const at = (num) => (num === 1) ? "" : num;
    if (!data.d1) {
        const y = subt("ac21") / subt("ab21");
        const x = (c1 - (b1 * y)) / a1
        if (!isFinite(x) || !isFinite(y)) return interact.reply({
            embeds: [embErr("Math Error, You got Infinity Solution/No Solution")],
            flags: 64
        });
        embed
            .setTitle("EQN XY Linear Solver")
            .setDescription(`
**Your Equation**:
${at(a1)}**X** ${at((b1 > 0) ? `+ ${b1}` : `- ${-b1}`)}**Y** = ${c1}
${at(a2)}**X** ${at((b2 > 0) ? `+ ${b2}` : `- ${-b2}`)}**Y** = ${c2}
**XY Value**:
X ${!Number.isInteger(x) && !fr ? "≈" : "="} ${x}
Y ${!Number.isInteger(y) && !fr ? "≈" : "="} ${y}
`)
        await interact.reply({
            embeds: [embed]
        })
    } else {
        const {
            d1,
            d2,
            a3,
            b3,
            c3,
            d3
        } = data
        const y = ((subt("da12") * subt("ca23")) + (subt("ca12") * subt("da32"))) / ((subt("ba12") * subt("ca23")) + (subt("ca12") * subt("ba32")))
        const z = (subt("da23") - (subt("ba23") * y)) / subt("ca23");
        const x = (d1 - (c1 * z) - (b1 * y)) / a1;
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) return interact.reply({
            embeds: [embErr("Math Error, You got Infinity Solution/No Solution")],
            flags: 64
        });
        embed
            .setTitle("EQN XYZ Linear Solver")
            .setDescription(`
**Your Equation**:
${at(a1)}**X** ${at((b1 > 0) ? `+ ${b1}` : `- ${-b1}`)}**Y** ${at((c1 > 0) ? `+ ${c1}` : `- ${-c1}`)}**Z** = ${d1}
${at(a2)}**X** ${at((b2 > 0) ? `+ ${b2}` : `- ${-b2}`)}**Y** ${at((c2 > 0) ? `+ ${c2}` : `- ${-c2}`)}**Z** = ${d2}
${at(a3)}**X** ${at((b3 > 0) ? `+ ${b3}` : `- ${-b3}`)}**Y** ${at((c3 > 0) ? `+ ${c3}` : `- ${-c3}`)}**Z** = ${d3}
**XYZ Value**:
X ${!Number.isInteger(x) && !fr ? "≈" : "="} ${dcf(x)}
Y ${!Number.isInteger(y) && !fr ? "≈" : "="} ${dcf(y)}
Z ${!Number.isInteger(z) && !fr ? "≈" : "="} ${dcf(z)}
`)
        await interact.reply({
            embeds: [embed]
        })
    }
}