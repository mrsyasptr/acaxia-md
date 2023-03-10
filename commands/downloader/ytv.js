import { downloadVideo, downloadYTShort } from '../../lib/YouTube.js'
import { utility } from '../../lib/utils/index.js'

const command = {
	name: "ytv",
	alias: ["ytmp4"],
	async exec(conn, m, { cmdName, prefix, readMore }) {
		if (!m.args) return conn.sendMessage(m.chat, { text: `Ex ${prefix + cmdName} https://youtube.com/xxx` })
		let media
		if(m.args[0].match("shorts")) {
			media = await downloadVideo(m.args[0])
		} else {
			media = await downloadYTShort(m.args[0])
		}
		conn.sendMessage(m.chat, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: `${media.title}.mp4`, caption: `${readMore} š„ļø *ššš„šš* _${media.title}_\nāļø *šš£š* _${utility.isUrl(m.args[0])}_\nš§ *š½šššššš«š* _${media.filesizeF}_\nāļøļø *āš¦šššš„šŖ* _${m.args[1] || '360p'}_` }, {
			quoted: {
				key: {
					participant: "0@s.whatsapp.net",
					remoteJid: `${m.key.remoteJid}`
				},
				message: {
					productMessage: {
						product: {
							title: media.title
						},
						businessOwnerJid: "0@s.whatsapp.net"
					}
				}
			}
		})
	}
}

export default command