import fs from "fs"

const command = {
	name: "jadwal",
	alias: [],
	desc: "Jadwal of the day",
	async exec(conn, m, { readMore }) {
		let hariini = new Date().getDay()
		let jadwal = fs.readFileSync("./assets/jadwal/" + (hariini + 1)).toString().replace("/readmore", readMore)
		let image = fs.readFileSync("./assets/image/itsuki1.png")
		conn.sendMessage(m.chat, {
			text: `${jadwal.replaceAll("/t", "").replaceAll("/m", "*")}`,
			contextInfo: {
				externalAdReply: {
					title: `Jadwal Besok (${global.date.tomorrow})`,
					mediaType: 3,
					thumbnail: image,
					sourceUrl: "https://chat.whatsapp.com/Kfy7N6p3BewIPxBU710YEF"
				}
			}
		}, {quoted: m})
	}
}

export default command