import { ytsearch } from "../../module/YouTube-Search.js"
import { namecard } from '../../module/NameCard/drawer.js'

const command = {
	name: "yts",
	alias: ["ytsearch"],
	desc: "ajajaj",
	async exec(conn, m, { cmdName, prefix }) {
		if (!m.text && !m.chat.verified()) return conn.sendMessage(m.chat, { text: `*Usage:* ${prefix + cmdName} <query>\n*Ex:* ${prefix + cmdName} burbank - sorry, i like you` })
		const listMessage = {
			text: "This is a list",
			title: "!! Youtube Search !!",
			buttonText: "Required, text on the button to view the list",
			sections: await ytsearch(m.text)
		}
		conn.sendMessage(m.chat, listMessage, { quoted: m })
	}
}

export default command