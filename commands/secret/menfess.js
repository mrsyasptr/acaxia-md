import fs from "fs"

const command = {
	name: "menfess",
	alias: ["mf"],
	desc: "Mention confess",
	async exec(conn, m, { readMore }) {
		conn.sendMessage("120363042881511206@g.us", { text: `Menfess To @${m.args[0]}\n${readMore}\n${m.args.slice(1).join(" ")}\n`, mentions: [`${m.args[0]}@s.whatsapp.net`,m.from], contextInfo: { mentionedJid: [`${m.args[0]}@s.whatsapp.net`,m.from] } })
	}
}

export default command