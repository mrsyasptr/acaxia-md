import fs from "fs"

const command = {
	name: "menu",
	alias: ["help"],
	desc: "Menampilkan daftar perintah",
	async exec(conn, m, { command, prefix, readMore }) {
		const theme = global.db.users[m.sender] ? global.db.users[m.sender]["menu-img"] != undefined ? global.db.users[m.sender]["menu-img"] : "default" : "default"
		console.log(theme)
		let mainText = fs.readFileSync("./assets/txt/menu-scheme.txt").toString(), text = ""
		let themeDir
		switch(theme) {
			case 'default':
				themeDir = global.pathin("./assets/menu-theme/default")
				break
			case 'genshin':
				themeDir = global.pathin("./assets/menu-theme/genshin")
				break
		}
		const images = fs.readdirSync(themeDir).map(e => `${themeDir}/${e}`)
		for (let category of command.category) {
				text += `${command.list[category].length == 0 ? `` : `╥─┈┈「 *${category.charAt(0).toUpperCase() + category.slice(1)}-Menu* 」♡͜͡✿\n${command.list[category].map((cmd) => `│➛ _${prefix + cmd.name}_`).join("\n")}\n╰───┈┈╌\n\n` }`
			}
		conn.sendMessage(m.chat, {
			image: {
				url: images.random()
			},
			caption: mainText
				.replace(/:here:/g, text)
				.replace(/:readmore:/g, readMore)
				.replace(/:pushname:/g, m.pushName)
		}, { quoted: m })
	}
}

export default command
