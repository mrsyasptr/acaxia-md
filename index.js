import './config.js'
import { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { makeWASocket, serialize } from './lib/utils/Simpler.js'
import cfonts from 'cfonts'
import P from 'pino'
import { format } from 'util'
import handler from './handler.js'
import commandReader from './module/CommandReader.js'

async function connect() {

	// --------- Important
	const cmd = commandReader('./commands')
	const { state, saveCreds } = await useMultiFileAuthState(global.config.path.session)
	const sock = makeWASocket({
		logger: P({ level: "silent" }),
		printQRInTerminal: true,
		generateHighQualityLinkPreview: true,
		auth: state
	})

	// --------- Events
	sock.ev.process(
		async(events) => {

			// --------- Close & Open Connection
			if(events['connection.update']) {
				const update = events['connection.update']
				const { lastDisconnect, connection } = update
				if(connection === 'close') {
					if(lastDisconnect?.error?.output?.statusCode != 401) {
						connect()
					} else if(lastDisconnect?.error?.output?.statusCode != 515) {
						connect()
					} else {
						console.log('Connection closed. You are logged out.')
					}
				} else if(connection === "open") {
					// -------- Intro
					console.clear()
					cfonts.say(`${global.config.bot_name}Bot`, {
						font: 'tiny',
						align: 'center',
						colors: ['white'],
						env: 'node'
					})
				}
			}

			// --------- Message Revceive
			if(events['messages.upsert']) {
				const msg = events['messages.upsert']
				const m = serialize(sock, msg.messages[0])
				if (!m.message) return
				if (m.key && m.key.remoteJid == 'status@broadcast') return
				if (m.key.id.startsWith('BAE5') && m.key.id.length == 16) return
				handler(sock, m, cmd, msg)
			}

			if(events['creds.update']) {
				await saveCreds()
			}

		}
	)
}
connect()

