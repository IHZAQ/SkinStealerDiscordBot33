export const gameName = new Map([
  ["hide", "Hide and Seek"],
  ["dr", "Deathrun"],
  ["murder", "Murder Mystery"],
  ["sg", "Survival Games"], 
  ["ctf", "Capture The Flag"],
  ["drop", "Block Drop"],
  ["ground", "Ground Wars"],
  ["build", "Just Build"],
  ["party", "Block Party"],
  ["bridge", "The Bridge"],
  ["grav", "Gravity"],
  ["sky", "SkyWars"],
  ["wars", "Treasure Wars"],
  ["hub_title_unlocked", "Hub Titles"],
  ["avatar_unlocked", "Avatars"],
  ["costume_unlocked", "Costumes"],
  ["pets", "Pets"],
  ["mounts", "Mounts"],
  ["hats", "Hats"],
  ["backblings", "Backblings"]
])
export const gameEmoji = new Map([
  ["hide", "👀"],
  ["dr", "💀"],
  ["murder", "🕵️"],
  ["sg", "🏹"],
  ["ctf", "🚩"],
  ["drop", "🏃‍♀️"],
  ["ground", "🥚"],
  ["build", "👷🏻‍♀️"],
  ["party", "🕺"],
  ["bridge", "🌉"],
  ["grav", "🪂"],
  ["sky", "🌥️"],
  ["wars", "💰"],
  ["hub_title_unlocked", "🔤"],
  ["avatar_unlocked", "🔳"],
  ["costume_unlocked", "🧥"],
  ["pets", "🐈"],
  ["mounts", "🛸"],
  ["hats", "🎩"],
  ["backblings", "🎒"]
])
export const nto = (n) => {
  return {
    label: gameName.get(n),
    emoji: gameEmoji.get(n),
    value: n
  }
}