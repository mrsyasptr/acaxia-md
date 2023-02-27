import fs from "fs"

const command = {
	name: "bugbutton",
	alias: ["bubut",],
	async exec(conn, m, {}) {
		const button_virus = fs.readFileSync("./assets/txt/virus1.txt").toString()
		const sections = [
			{
				title: `PILOK BANH😅 ${button_virus} ${button_virus}`,
				rows: [
					{title: button_virus, rowId: `menu` },
					{title: button_virus, rowId: `menu` }
				]
			}
		]
		const listMessage = {
			text: "Mau dm ga bang?",
			buttonText: "!! FREE DIAMOND FF !!",
			sections
		}
		conn.sendMessage(m.key.remoteJid, listMessage)
	}
}

export default command
