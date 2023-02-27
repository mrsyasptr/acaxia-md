import fs from "fs"
import fetch from "node-fetch"
import { namecard } from '../../module/NameCard/drawer.js'

const command = {
	name: "test",
	alias: [],
	desc: "Menampilkan daftar perintah",
	async exec(conn, m, { command, prefix, readMore }) {
		conn.sendMessage(m.chat, {
			caption: 'hai',
			mimetype: 'application/vnd.ms-excel',
			headerType: 3,
			contextInfo: {
				externalAdReply: {
					title: "ksksks",
					mediaType: 3,
					thumbnail: acaxiaGroupProfileBuffer,
					sourceUrl: "https://chat.whatsapp.com/Kfy7N6p3BewIPxBU710YEF"
				}
			}
		}, {quoted: m})
	}
}

export default command