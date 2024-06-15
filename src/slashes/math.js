import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js"
import base from "./math/base.js"
import eqn from "./math/eqn.js"
import eqnunk from "./math/eqnunk.js"

export default {
    cooldown: 8,
    category: "Math / Complex Mode",
    usage: {
        base: "Base 2-36 Number Converter",
        eqn: "Get X's value for Quadratic Equation",
        eqnunk: {
            two: "Get XY value for Linear Equation",
            three: "Get XYZ value for Linear Equation"
        }
    },
    data: new SlashCommandBuilder()
        .setName("math")
        .setDescription("Math")
        .addSubcommand(command =>
            command.setName("base")
                .setDescription("Base 2-36 Number Converter")
                .addStringOption(option =>
                    option.setName("num1")
                        .setDescription("First Number")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("base1")
                        .setDescription("Base Of First Number")
                        .setMinValue(2)
                        .setMaxValue(36)
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("base2")
                        .setDescription("Base Of Result Number")
                        .setMinValue(2)
                        .setMaxValue(36)
                        .setRequired(true))
        )
        .addSubcommand(command =>
            command.setName("eqn")
                .setDescription("Get X's value for Quadratic Equation")
                .addNumberOption(option =>
                    option.setName("a")
                        .setDescription("A value")
                        .setMinValue(-100000)
                        .setMaxValue(100000)
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName("b")
                        .setDescription("B value")
                        .setMinValue(-100000)
                        .setMaxValue(100000)
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName("c")
                        .setDescription("C value")
                        .setMinValue(-100000)
                        .setMaxValue(100000)
                        .setRequired(true))
        )
        .addSubcommandGroup(command =>
            command.setName("eqnunk")
                .setDescription("eqnunk")
                .addSubcommand(command =>
                    command.setName("two")
                        .setDescription("Get XY value from Two Linear Equation")
                        .addNumberOption(option =>
                            option.setName("a1")
                                .setDescription("A of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("b1")
                                .setDescription("B of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("c1")
                                .setDescription("C of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("a2")
                                .setDescription("A of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("b2")
                                .setDescription("B of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("c2")
                                .setDescription("C of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                )
                .addSubcommand(command =>
                    command.setName("three")
                        .setDescription("Get XYZ value from Three Linear Equation")
                        .addNumberOption(option =>
                            option.setName("a1")
                                .setDescription("A of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("b1")
                                .setDescription("B of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("c1")
                                .setDescription("C of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("d1")
                                .setDescription("D of First Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("a2")
                                .setDescription("A of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("b2")
                                .setDescription("B of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("c2")
                                .setDescription("C of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("d2")
                                .setDescription("D of Second Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("a3")
                                .setDescription("A of Third Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("b3")
                                .setDescription("B of Third Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("c3")
                                .setDescription("C of Third Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                        .addNumberOption(option =>
                            option.setName("d3")
                                .setDescription("D of Third Equation")
                                .setMinValue(-100000)
                                .setMaxValue(100000)
                                .setRequired(true))
                )
        ),
    async execute(interact, client) {
        const subcommand = interact.options.getSubcommand()
        switch (subcommand) {
            case "base":
                await base(interact, client)
                break;
            case "eqn":
                await eqn(interact, client)
                break;
            case "two": case "three":
                await eqnunk(interact, client)
        }
    }
}