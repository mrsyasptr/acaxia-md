import fs from 'fs'

export default function commandReader(cmdfolder) {
	let cmd = new Map(), list_cmd = {}, all_cmd = []
	let dir = global.pathin(`${cmdfolder}`)
	let folders = fs.readdirSync(dir)
	try {
		folders.forEach(type => {
			list_cmd[type] = []
			let files = fs.readdirSync(`${dir}/${type}`)
				.filter((file) => file.endsWith(".js"))
			cmd.category = folders
				.filter(v => v !== "_")
				.map(v => v)
			for (let file of files) {
				import(`${dir}/${type}/${file}`).then((command) => {
					command = command.default
					if (typeof command.exec != "function") return
					all_cmd.push(...[command.name, ...command?.alias])
					list_cmd[type].push(command)
					if(!cmd[command.name]) cmd.set(command.name, command)
				})
			}
		})
		cmd.prefix = /^[/.!#]/
		cmd.list = list_cmd
		cmd.all = all_cmd
	} catch (e) {
		console.log(e)
	}
	return cmd
}