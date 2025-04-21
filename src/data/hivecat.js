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
  ["bed", "Bedwars"],
  ["grav", "Gravity"],
  ["sky", "SkyWars"],
  ["wars", "Treasure Wars"],
  ["parkour", "Parkour"],
  ["sky-classic", "SkyWars (Classic)"],
  ["sky-kits", "SkyWars (Kits)"],
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
  ["sg", "⚔️"],
  ["ctf", "🚩"],
  ["drop", "🚶"],
  ["ground", "🥚"],
  ["build", "👷🏻‍♀️"],
  ["party", "🕺"],
  ["bridge", "🌉"],
  ["bed", "🛏️"],
  ["grav", "🪂"],
  ["sky", "🏹"],
  ["wars", "💰"],
  ["parkour", "🏃"],
  ["sky-classic", "🏹"],
  ["sky-kits", "🏹"],
  ["hub_title_unlocked", "🔤"],
  ["avatar_unlocked", "🔳"],
  ["costume_unlocked", "🧥"],
  ["pets", "🐈"],
  ["mounts", "🛸"],
  ["hats", "🎩"],
  ["backblings", "🎒"]
])
export const addChoice = [
  { name: 'Hide and Seek 👀', value: 'hide' },
  { name: 'Deathrun 💀', value: 'dr' },
  { name: 'Murder Mystery 🕵️', value: 'murder' },
  { name: 'Capture The Flag 🚩', value: 'ctf' },
  { name: 'Block Drop 🚶', value: 'drop' },
  { name: 'Ground Wars 🥚', value: 'ground' },
  { name: 'Just Build 👷🏻‍♀️', value: 'build' },
  { name: 'Block Party 🕺', value: 'party' },
  { name: 'The Bridge 🌉', value: 'bridge' },
  { name: 'Bedwars 🛏️', value: 'bed' },
  { name: 'Gravity 🪂', value: 'grav' },
  { name: 'SkyWars 🏹', value: 'sky' },
  { name: 'Treasure Wars 💰', value: 'wars' }
]
export const nto = (n) => {
  return {
    label: gameName.get(n) || n,
    emoji: gameEmoji.get(n) || "❔",
    value: n
  }
}