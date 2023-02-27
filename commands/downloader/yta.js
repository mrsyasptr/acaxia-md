import { downloadAudio } from '../../lib/YouTube.js'
import ytdl from 'ytdl-core';
import fs from 'fs';
import fetch from 'node-fetch';

const command = {
	name: "yta",
	alias: ["ytmp3"],
	async exec(conn, m, { cmdName, prefix }) {
		if(!m.args) return conn.sendMessage(m.chat, { text: `Ex ${prefix + cmdName} https://youtube.com/xxx` })
		let videoInfo = await ytdl.getInfo(m.args[0]), media
		if (videoInfo.videoDetails.isMusic) media = await downloadAudioFromTopic(m.args[0])
		else media = await downloadAudio(m.args[0])
		if(m.args.length == 1) {
			let buttons = [
				{ buttonId: `${prefix}yta ${m.args[0]} document`, buttonText: { displayText: "Document" }, type: 1 },
				{ buttonId: `${prefix}yta ${m.args[0]} audio`, buttonText: { displayText: "Audio" }, type: 1 }
			]
			let buttonMessage = {
				text: "Download",
				buttons,
				contextInfo: {
					externalAdReply: {
						mediaUrl: "https://youtube.com",
						mediaType: 3,
						title: "p",
						body: "oke",
						sourceUrl: m.args[0],
						thumbnail: await (await fetch(media.thumbnail)).arrayBuffer()
					}
				}
			}
			conn.sendMessage(m.chat, buttonMessage)
		} else if(m.args.length == 2) {
			if(m.args[1] == "document") {
				conn.sendMessage(m.chat, { document: { url: media.dl_link }, mimetype: 'audio/mp4', fileName: media.title })
			} else if(m.args[1] == "audio") {
				conn.sendMessage(m.chat, { audio: { url: media.dl_link }, mimetype: 'audio/mp4' })
			}
		}
	}
}

export default command