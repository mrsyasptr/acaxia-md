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
		conn.sendMessage(m.chat, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: `${media.title}.mp4`, caption: `${readMore} 🌥️ *𝕋𝕚𝕥𝕝𝕖* _${media.title}_\n☁️ *𝕌𝕣𝕝* _${utility.isUrl(m.args[0])}_\n🌧 *𝔽𝕚𝕝𝕖𝕊𝕚𝕫𝕖* _${media.filesizeF}_\n⛈️️ *ℚ𝕦𝕒𝕝𝕚𝕥𝕪* _${m.args[1] || '360p'}_` }, {
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