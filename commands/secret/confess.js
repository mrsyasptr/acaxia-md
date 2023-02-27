import fs from "fs"

const command = {
	name: "confess",
	alias: ["cf"],
	desc: "Confess",
	async exec(conn, m, { args, readMore }) {
		conn.sendMessage(`${args[0]}@s.whatsapp.net`, { text: `==---------------=------= 💌 =------=----------------==\n\n*Pesan:* _${args.slice(1).join(" ")}_\n\n==---------------=------====------=----------------==` })
	}
}

export default command