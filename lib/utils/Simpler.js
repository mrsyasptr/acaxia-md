import Jimp from 'jimp'
import chalk from 'chalk'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import { imageToWebp, videoToWebp, writeExif } from '../Sticker.js'
import { fileTypeFromBuffer } from 'file-type'
import { format } from 'util'

/**
 * @type {import('@adiwajshing/baileys')}
 */
const {
	default: _makeWaSocket,
	makeWALegacySocket,
	proto,
	downloadContentFromMessage,
	jidDecode,
	areJidsSameUser,
	generateForwardMessageContent,
	generateWAMessageFromContent,
	WAMessageStubType,
	extractMessageContent,
	jidNormalizedUser, 
	MessageType,
	Mimetype
} = (await import('@adiwajshing/baileys')).default


export function makeWASocket(connectionOptions, options = {}) {
	connectionOptions = {
		...connectionOptions,
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage ||
				message.listMessage
			)
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				}
			}
			return message
		}
	}
	let conn = _makeWaSocket(connectionOptions)

	let sock = Object.defineProperties(conn, {
		chats: {
			value: { ...(options.chats || {}) },
			writable: true
		},
		decodeJid: {
			value(jid) {
				if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
				return jidDecode(jid)
			}
		},
		/**
		 * getFile hehe
		 * @param {fs.PathLike} PATH 
		 * @param {Boolean} saveToFile
		 */
		getFile: {
			async value(PATH, saveToFile = false) {
				let res, filename
				const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
				if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
				const type = await fileTypeFromBuffer(data) || {
					mime: 'application/octet-stream',
					ext: '.bin'
				}
				if (data && saveToFile && !filename) (filename = global.pathin('tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
				return {
					res,
					filename,
					...type,
					data,
					deleteFile() {
						return filename && fs.promises.unlink(filename)
					}
				}
			},
			enumerable: true
		},
		/**
		 * genOrderMessage
		 * @param {String} message 
		 * @param {*} options 
		 * @returns 
		 */
		async genOrderMessage(message, options) {
			let m = {}
			switch (type) {
				case MessageType.text:
				case MessageType.extendedText:
					if (typeof message === 'string') message = { text: message }
					m.extendedTextMessage = WAMessageProto.ExtendedTextMessage.fromObject(message)
					break
				case MessageType.location:
				case MessageType.liveLocation:
					m.locationMessage = WAMessageProto.LocationMessage.fromObject(message)
					break
				case MessageType.contact:
					m.contactMessage = WAMessageProto.ContactMessage.fromObject(message)
					break
				case MessageType.contactsArray:
					m.contactsArrayMessage = WAMessageProto.ContactsArrayMessage.fromObject(message)
					break
				case MessageType.groupInviteMessage:
					m.groupInviteMessage = WAMessageProto.GroupInviteMessage.fromObject(message)
					break
				case MessageType.listMessage:
					m.listMessage = WAMessageProto.ListMessage.fromObject(message)
					break
				case MessageType.buttonsMessage:
					m.buttonsMessage = WAMessageProto.ButtonsMessage.fromObject(message)
					break
				case MessageType.image:
				case MessageType.sticker:
				case MessageType.document:
				case MessageType.video:
				case MessageType.audio:
					m = await conn.prepareMessageMedia(message, type, options)
					break
				case 'orderMessage':
					m.orderMessage = WAMessageProto.OrderMessage.fromObject(message)
			}
			return WAMessageProto.Message.fromObject(m)
		},

		/**
		 * Send Media/File with Automatic Type Specifier
		 * @param {String} jid
		 * @param {String|Buffer} path
		 * @param {String} filename
		 * @param {String} caption
		 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
		 * @param {Boolean} ptt
		 * @param {Object} options
		 */

sendFile: {
async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
	let type = await conn.getFile(path, true)
	let { res, data: file, filename: pathFile } = type
	if (res && res.status !== 200 || file.length <= 65536) {
		try { throw { json: JSON.parse(file.toString()) } }
		catch (e) { if (e.json) throw e.json }
	}
	const fileSize = fs.statSync(pathFile).size / 1024 / 1024
	if (fileSize >= 100) throw new Error('File size is too big!')
	let opt = {}
	if (quoted) opt.quoted = quoted
	let mtype = '', mimetype = type.mime, convert
	if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
	else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
	else if (/video/.test(type.mime)) mtype = 'video'
	else if (/audio/.test(type.mime)) (
		convert = await toAudio(file, type.ext),
		file = convert.data,
		pathFile = convert.filename,
		mtype = 'audio',
		mimetype = 'audio/ogg; codecs=opus'
	)
	else mtype = 'document'

	let message = {
		caption,
		...options,
		ptt,
		[mtype]: { url: pathFile },
		mimetype,
		fileName: filename || pathFile.split('/').pop()
	}
	let m
	try {
		m = await conn.sendMessage(jid, message, { ...opt, ...options })
	} catch (e) {
		console.error(e)
		m = null
	} finally {
		if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
		file = null
		return m
	}
	},
	enumerable: true
},
		sendSticker: {
			async value(jid, mime, media, options = {}) {
				let sticker = await writeExif({ mimetype: mime, data: media }, options.metadata)
				delete options.metadata
				return conn.sendMessage(jid, { sticker }, options)
			},
			enumerable: true
		},
		/**
		 * Reply to a message
		 * @param {String} jid
		 * @param {String|Buffer} text
		 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
		 * @param {Object} options
		 */
		reply: {
			value(jid, text = '', quoted, options) {
				let pp = conn.profilePictureUrl(conn.user.jid, 'image')
				const _uptime = process.uptime() * 1000
				return Buffer.isBuffer(text) ? conn.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, { ...options,
				text,
				mentions: text.parseMention(),
				...options }, {
					quoted,
					ephemeralExpiration: 86400,
					...options
				})
			}
		},
		/**
		 * Exact Copy Forward
		 * @param {String} jid
		 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
		 * @param {Boolean|Number} forwardingScore
		 * @param {Object} options
		 */
		copyNForward: {
			async value(jid, message, forwardingScore = true, options = {}) {
				let vtype
				if (options.readViewOnce && message.message.viewOnceMessage?.message) {
					vtype = Object.keys(message.message.viewOnceMessage.message)[0]
					delete message.message.viewOnceMessage.message[vtype].viewOnce
					message.message = proto.Message.fromObject(
						JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
					)
					message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
				}
				let mtype = Object.keys(message.message)[0]
				let m = generateForwardMessageContent(message, !!forwardingScore)
				let ctype = Object.keys(m)[0]
				if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
				m[ctype].contextInfo = {
					...(message.message[mtype].contextInfo || {}),
					...(m[ctype].contextInfo || {})
				}
				m = generateWAMessageFromContent(jid, m, {
					...options,
					userJid: conn.user.jid
				})
				await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
				return m
			},
			enumerable: true
		},
		/**
		 * Download media message
		 * @param {Object} m
		 * @param {String} type
		 * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
		 * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
		 */
		downloadM: {
			async value(m, type, saveToFile) {
				let filename
				if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
				const stream = await downloadContentFromMessage(m, type)
				let buffer = Buffer.from([])
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				if (saveToFile) ({ filename } = await conn.getFile(buffer, true))
				return saveToFile && fs.existsSync(filename) ? filename : buffer
			},
			enumerable: true
		},

		saveName: {
			async value (id, name = '') {
				if (!id) return
				id = conn.decodeJid(id)
				let isGroup = id.endsWith('@g.us')
				if (id in conn.contacts && conn.contacts[id][isGroup ? 'subject' : 'name'] && id in conn.chats) return
				let metadata = {}
				if (isGroup) metadata = await conn.groupMetadata(id)
				let chat = { ...(conn.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc } : { name }) }
				conn.contacts[id] = chat
				conn.chats[id] = chat
			}
		},
		/**
		 * Load Message
		 * @param {String} messageID 
		 * @returns {import('@adiwajshing/baileys').proto.WebMessageInfo}
		 */
		loadMessage: {
			value(messageID) {
				return Object.entries(conn.chats)
					.filter(([_, { messages }]) => typeof messages === 'object')
					.find(([_, { messages }]) => Object.entries(messages)
						.find(([k, v]) => (k === messageID || v.key?.id === messageID)))
					?.[1].messages?.[messageID]
			},
			enumerable: true
		},
		/**
		 * sendGroupV4Invite
		 * @param {String} jid 
		 * @param {*} participant 
		 * @param {String} inviteCode 
		 * @param {Number} inviteExpiration 
		 * @param {String} groupName 
		 * @param {String} caption 
		 * @param {Buffer} jpegThumbnail
		 * @param {*} options 
		 */
		sendGroupV4Invite: {
			async value(jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', jpegThumbnail, options = {}) {
				const msg = proto.Message.fromObject({
					groupInviteMessage: proto.GroupInviteMessage.fromObject({
						inviteCode,
						inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
						groupJid: jid,
						groupName: (groupName ? groupName : await conn.getName(jid)) || null,
						jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
						caption
					})
				})
				const message = generateWAMessageFromContent(participant, msg, options)
				await conn.relayMessage(participant, message.message, { messageId: message.key.id, additionalAttributes: { ...options } })
				return message
			},
			enumerable: true
		},
		/**
		 * to process MessageStubType
		 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m 
		 */
		processMessageStubType: {
			async value(m) {
				if (!m.messageStubType) return
				const chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
				if (!chat || chat === 'status@broadcast') return
				const emitGroupUpdate = (update) => {
					ev.emit('groups.update', [{ id: chat, ...update }])
				}
				switch (m.messageStubType) {
					case WAMessageStubType.REVOKE:
					case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
						emitGroupUpdate({ revoke: m.messageStubParameters[0] })
						break
					case WAMessageStubType.GROUP_CHANGE_ICON:
						emitGroupUpdate({ icon: m.messageStubParameters[0] })
						break
					default: {
						console.log({
							messageStubType: m.messageStubType,
							messageStubParameters: m.messageStubParameters,
							type: WAMessageStubType[m.messageStubType]
						})
						break
					}
				}
				const isGroup = chat.endsWith('@g.us')
				if (!isGroup) return
				let chats = conn.chats[chat]
				if (!chats) chats = conn.chats[chat] = { id: chat }
				chats.isChats = true
				const metadata = await conn.groupMetadata(chat).catch(_ => null)
				if (!metadata) return
				chats.subject = metadata.subject
				chats.metadata = metadata
			}
		},
		relayWAMessage: {
			async value (pesanfull) {
				if (pesanfull.message.audioMessage) {
					await conn.sendPresenceUpdate('recording', pesanfull.key.remoteJid)
				} else {
					await conn.sendPresenceUpdate('composing', pesanfull.key.remoteJid)
				}
				var mekirim = await conn.relayMessage(pesanfull.key.remoteJid, pesanfull.message, { messageId: pesanfull.key.id })
				conn.ev.emit('messages.upsert', { messages: [pesanfull], type: 'append' })
				return mekirim
			}
		},
		insertAllGroup: {
			async value() {
				const groups = await conn.groupFetchAllParticipating().catch(_ => null) || {}
				for (const group in groups) conn.chats[group] = { ...(conn.chats[group] || {}), id: group, subject: groups[group].subject, isChats: true, metadata: groups[group] }
				return conn.chats
			},
		},
		/**
		 * pushMessage
		 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} m 
		 */
		pushMessage: {
			async value(m) {
				if (!m) return
				if (!Array.isArray(m)) m = [m]
				for (const message of m) {
					try {
						if (!message) continue
						if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) conn.processMessageStubType(message).catch(console.error)
						const _mtype = Object.keys(message.message || {})
						const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
							(_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
							_mtype[_mtype.length - 1]
						const chat = conn.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
						if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
							let context = message.message[mtype].contextInfo
							let participant = conn.decodeJid(context.participant)
							const remoteJid = conn.decodeJid(context.remoteJid || participant)
							let quoted = message.message[mtype].contextInfo.quotedMessage
							if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
								let qMtype = Object.keys(quoted)[0]
								if (qMtype == 'conversation') {
									quoted.extendedTextMessage = { text: quoted[qMtype] }
									delete quoted.conversation
									qMtype = 'extendedTextMessage'
								}
								if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
								quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
								const isGroup = remoteJid.endsWith('g.us')
								if (isGroup && !participant) participant = remoteJid
								const qM = {
									key: {
										remoteJid,
										fromMe: areJidsSameUser(conn.user.jid, remoteJid),
										id: context.stanzaId,
										participant,
									},
									message: JSON.parse(JSON.stringify(quoted)),
									...(isGroup ? { participant } : {})
								}
								let qChats = conn.chats[participant]
								if (!qChats) qChats = conn.chats[participant] = { id: participant, isChats: !isGroup }
								if (!qChats.messages) qChats.messages = {}
								if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
								let qChatsMessages
								if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
							}
						}
						if (!chat || chat === 'status@broadcast') continue
						const isGroup = chat.endsWith('@g.us')
						let chats = conn.chats[chat]
						if (!chats) {
							if (isGroup) await conn.insertAllGroup().catch(console.error)
							chats = conn.chats[chat] = { id: chat, isChats: true, ...(conn.chats[chat] || {}) }
						}
						let metadata, sender
						if (isGroup) {
							if (!chats.subject || !chats.metadata) {
								metadata = await conn.groupMetadata(chat).catch(_ => ({})) || {}
								if (!chats.subject) chats.subject = metadata.subject || ''
								if (!chats.metadata) chats.metadata = metadata
							}
							sender = conn.decodeJid(message.key?.fromMe && conn.user.id || message.participant || message.key?.participant || chat || '')
							if (sender !== chat) {
								let chats = conn.chats[sender]
								if (!chats) chats = conn.chats[sender] = { id: sender }
								if (!chats.name) chats.name = message.pushName || chats.name || ''
							}
						} else if (!chats.name) chats.name = message.pushName || chats.name || ''
						if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
						chats.isChats = true
						if (!chats.messages) chats.messages = {}
						const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, conn.user.id)
						if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
							delete message.message.messageContextInfo
							delete message.message.senderKeyDistributionMessage
							chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
							let chatsMessages
							if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
						}
					} catch (e) {
						console.error(e)
					}
				}
			}
		}
	})
	if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
	return sock
}


/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn 
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
 */
export function serialize(conn, m, hasParent) {
	if (!m) return m
	let M = proto.WebMessageInfo
	m = M.fromObject(m)
	if (m.key) {
		m.id = m.key.id
		m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
		m.chat = m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || ''
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || ''
		m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id)
	}
	if (m.message) {
		let mtype = Object.keys(m.message)
		m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || mtype[mtype.length - 1]
		m.msg = m.message[m.mtype]
		m.text = m.message?.conversation || m.msg?.caption || m.msg?.text || m.msg?.selectedId || m.msg?.selectedButtonId || m.msg?.contentText || m.msg?.message || m.msg?.selectedDisplayText || m.msg?.hydratedContentText || m.msg?.singleSelectReply?.selectedRowId || ""
		m.args = m.text.trim().split(/ +/).slice(1)
		if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
		if (m.mtype == 'protocolMessage' && m.msg.key) {
			if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
			if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
			if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender
			m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id)
		}
		if (typeof m.text !== 'string') {
			if ([
				'protocolMessage',
				'messageContextInfo',
				'stickerMessage',
				'audioMessage',
				'senderKeyDistributionMessage'
			].includes(m.mtype)) m.text = ''
		}
		m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
		let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
		if (m.quoted) {
			let type = Object.keys(m.quoted)[0]
			m.quoted = m.quoted[type]
			if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
			m.quoted.mtype = type
			m.quoted.id = m.msg.contextInfo.stanzaId
			m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
			m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
			m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
			m.quoted.fromMe = m.quoted.sender === conn.user.jid
			m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
			m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
			let vM = m.quoted.fakeObj = M.fromObject({
				key: {
					fromMe: m.quoted.fromMe,
					remoteJid: m.quoted.chat,
					id: m.quoted.id
				},
				message: quoted,
				...(m.isGroup ? { participant: m.quoted.sender } : {})
			})
			m.getQuotedObj = m.getQuotedMessage = async () => {
				if (!m.quoted.id) return null
				let q = M.fromObject(await conn.loadMessage(m.quoted.id) || vM)
				return exports.smsg(conn, q)
			}
			if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => conn.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile)
			m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)
			m.quoted.forward = (jid, forceForward = false) => conn.forwardMessage(jid, vM, forceForward)
			m.quoted.copyNForward = (jid, forceForward = true, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
			m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })
		}
	}
	if (m.msg && m.msg.url) m.download = (saveToFile = false) => conn.downloadM(m.msg, m.mtype.replace(/message/i, ''), saveToFile)
	m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)
	m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => conn.copyNForward(jid, m, forceForward, options)
	m.delete = () => conn.sendMessage(m.chat, { delete: m.key })

	return m
}





