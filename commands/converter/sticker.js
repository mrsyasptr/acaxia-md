import fs from "fs"
import axios from "axios"
import { imageToWebp, videoToWebp, writeExif } from '../../lib/Sticker.js'

const command = {
	name: "sticker",
	alias: ["s","stiker"],
	desc: "Mengubah Gambar, Video, Gif Menjadi Stiker",
	async exec(conn, m, { cmdName, prefix, quoted, mime }) {
		console.log(m)
		if (/image|video|sticker/.test(mime)) {
			if(m.quoted) {
				let download = await m.quoted.download()
				conn.sendSticker(m.chat, mime, download, { metadata: "default" })
			} else {
				let download = await m.download()
				conn.sendSticker(m.chat, mime, download, { metadata: "default" })
			}
		} else if (m.mentionedJid) {
			let profile_url = await conn.profilePictureUrl(m.mentionedJid[0], "image")
			let { data } = await axios.get(profile_url, { responseType: "arraybuffer" })
			conn.sendSticker(m.chat, "image", data, { metadata: "default" })
		} else if (m.quoted.type == "templateMessage" || m.quoted.type == "buttonsMessage") {
			let message = m.quoted.imageMessage || m.quoted.videoMessage
			let download = await conn.downloadMediaMessage(message)
			conn.sendSticker(m.chat, mime, download, { metadata: "default" })
		} else {
			return m.reply(`Reply to Supported media With Caption ${prefix + cmdName}`, m.chat, { quoted: m })
		}
	}
}

export default command