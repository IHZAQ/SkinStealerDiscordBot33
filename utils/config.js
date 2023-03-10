module.exports = {
	colors: {
		default: "#BFFF00",
		error: "#FF4500"
	},
	norme: {
		footer: "Lightning Craft © 2023"
	}, 
	developers: [
    process.env.FOUNDER_ID
  ], 
  channels: {
    guildjoin: "", //Join Server Logs Channel Id
    guildleft: "", //Left Server Logs Channel Id
    reportlogs: "" //Report Bugs Logs Channel Id
  }, 
  guild_id: process.env.GUILD_ID
}