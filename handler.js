import { utility } from './lib/utils/index.js'
import { messageLogger } from './lib/Logger.js'
import { format } from 'util'
import fs from 'fs'

const readMore = String.fromCharCode(8206).repeat(4001)

const handler = async (conn, m, command, chatUpdate) => {
	try {

		// --------- Utility Variable
		const prefix = utility.checkPrefix(command.prefix, m.text).prefix ?? "."
		const quoted = m.quoted ?? m
		const mime = (quoted.msg || quoted).mimetype || ''
		const isMedia = /image|video|sticker|audio/.test(mime)

		const metadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(e => {}) : ''
		const cmdName = m.text.startsWith(prefix) ? m.text.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : "Bukan sebuah perintah"
		const isCmd = m.text.startsWith(prefix) ? command.all.includes(cmdName) : false
		const cmd = isCmd ? command.get(cmdName) || [...command.values()].find((x) => x.alias.find((x) => x.toLowerCase() == cmdName)) : {}

		// --------- Message Logger
		messageLogger(m, isCmd, metadata)

		// --------- Executing Command
		try {
			cmd.exec(conn, m, {
				cmdName,
				readMore,
				prefix,
				quoted,
				mime,
				command
			})
		} catch (e) {
			if (!/cmd.exec/.test(String(e)))
				m.reply(`*!! ERROR COMMAND !!*\n\n*Command* ${prefix+cmdName}\n*Sender* ${m.sender}\n*Chat* ${m.chat}\n*Arguments* ${m.text}\n\n_${format(e)}_\n\n`.trim(), global.config.owner + "@s.whatsapp.net")
		}
	} catch (e) {
		console.log(e)
	}
}

export default handler