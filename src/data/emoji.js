import emoji from "../../emoji.json" with { type: "json" };
export default (name) => emoji[name] ? `<:${name}:${emoji[name]}>` : "❔";