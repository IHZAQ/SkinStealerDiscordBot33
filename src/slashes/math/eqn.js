import {
  EmbedBuilder
} from "discord.js"
const at = (num) => (num === 1) ? "" : num;
export default async (interact, {
  config: {
    norme,
    colors
  },
  embErr,
  checkPerms
}) => {
  const a = interact.options.getNumber("a")
  const b = interact.options.getNumber("b")
  const c = interact.options.getNumber("c")
  const fr = interact.options.getString("fraction") || false
  const dcf = (decima) => {
    let decimal = Math.abs(decima)
    const neg = (decima != decimal) ? "-" : "";
    if (!fr) return `${neg}${decimal}`;
    if (typeof decimal !== "number" || isNaN(decimal)) return null;
    const [integerPart, decimalPart] = decimal.toString().split(".");
    if (!decimalPart) return `${neg}${integerPart}`;

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

  if (a == 0) {
    await interact.reply({
      embeds: [embErr("Get back to school kiddo, A value cannot be zero")],
      flags: 64
    })
    return;
  }
  const pembezalayan = (b ** 2) - (4 * a * c);
  if (pembezalayan < 0) {
    await interact.reply({
      embeds: [embErr("Math Error, you got [imaginary](https://www.google.com/search?q=imaginary+roots+of+quadratic+equation) number")],
      flags: 64
    })
    return;
  }
  await interact.deferReply(checkPerms(interact))
  const pembeza = (Math.sqrt(pembezalayan)) / (2 * a);
  const cx = -b / (2 * a);
  const x1 = cx + pembeza;
  const x2 = cx - pembeza;
  const cy = -(b ** b) / ((4 * a) + c);
  const embed = new EmbedBuilder()
    .setTitle("EQN Quadratic Solver")
    .setDescription(`
**Your Equation**:
${at(a)}**X²** ${at((b > 0) ? `+ ${b}` : `- ${-b}`)}**X** ${(c > 0) ? `+ ${c}` : `- ${-c}`} = 0
**X's Value**:
X${pembezalayan == 0 ? "" : "¹"} ${!Number.isInteger(x1) && !fr ? "≈" : "="} ${dcf(x1)}
${pembezalayan == 0 ? "" : `X² ${!Number.isInteger(x2) && !fr ? "≈" : "="} ${dcf(x2)}`}
**${a > 0 ? "Minimum " : "Maximum"} coordinates**:
(${dcf(cx)}, ${dcf(cy)})
`)
    .setColor(colors.default)
    .setFooter({
      text: norme.footer
    });
  await interact.editReply({
    embeds: [embed]
  })
}