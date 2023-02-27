import { utility } from './utils/index.js'
import chalk from 'chalk'

/**
 * Baileys Message Logger (only support original whatsapp message)
 * @param {Object} m <MessageInfo>
 * @param {Boolean} isCmd
 * @return console.log()
 */
export function messageLogger(m, isCmd, metadata) {
	m.sender = m.sender.split("@")[0]
	let blacklist = [
		"contactsArrayMessage",
		"contactMessage",
		"documentMessage"
	]

	// --- Command
	if (isCmd && m.isGroup && !blacklist.includes(m.mtype)) console.log(`🎐-${chalk.magenta.bold("Group")} at ${chalk.bold.green(utility.hms())} in ${chalk.bold.yellow(metadata.subject)} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.text)}`)
	if (isCmd && !m.isGroup && !blacklist.includes(m.mtype)) console.log(`🎐-${chalk.cyan.bold("Self")} at ${chalk.bold.green(utility.hms())} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.text)}`)

	// ---- Message
	if (!isCmd && m.isGroup && !["imageMessage","videoMessage","contactMessage","contactsArrayMessage","audioMessage"].includes(m.mtype)) console.log(`💬-${chalk.magenta.bold("Group")} at ${chalk.bold.green(utility.hms())} in ${chalk.bold.yellow(metadata.subject)} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.text)}`)
	if (!isCmd && !m.isGroup && !["imageMessage","videoMessage","contactMessage","contactsArrayMessage","audioMessage"].includes(m.mtype)) console.log(`💬-${chalk.cyan.bold("Self")} at ${chalk.bold.green(utility.hms())} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.text)}`)

	// --- Poll Message
	if (m.mtype == "'pollCreationMessage" && m.msg.options && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("📑PollMessage")} with ${chalk.magenta.italic(m.msg.options.length)} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "'pollCreationMessage" && m.msg.options && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("📑PollMessage")} with ${chalk.cyan.italic(m.msg.options.length)} at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Contact Message
	if (m.mtype == "contactMessage" && m.isGroup) console.log(`👤-${chalk.magenta.bold("Group")} at ${chalk.bold.green(utility.hms())} in ${chalk.bold.yellow(metadata.subject)} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.msg.displayName+" Contact")}`)
	if (m.mtype == "contactMessage" && !m.isGroup) console.log(`👤-${chalk.cyan.bold("Self")} at ${chalk.bold.green(utility.hms())} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.msg.displayName+" Contact")}`)

	// --- Contacts Array Message
	if (m.mtype == "contactsArrayMessage" && m.isGroup) console.log(`👥-${chalk.magenta.bold("Group")} at ${chalk.bold.green(utility.hms())} in ${chalk.bold.yellow(metadata.subject)} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.msg.contacts.length+" Contacts")}`)
	if (m.mtype == "contactsArrayMessage" && !m.isGroup) console.log(`👥-${chalk.cyan.bold("Self")} at ${chalk.bold.green(utility.hms())} from ${chalk.bold.green(m.sender)} ==> ${chalk.italic.cyan(m.msg.contacts.length+" Contacts")}`)

	// --- Location Message
	if (m.mtype == "locationMessage" && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🚩Location")} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "locationMessage" && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🚩Location")} at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Live Location Message
	if (m.mtype == "liveLocationMessage" && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🧭LiveLocation")} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "liveLocationMessage" && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🧭LiveLocation")} at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Document Message
	if (m.mtype == "documentMessage" && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("📄Document")} named with ${chalk.magenta.italic(m.msg.fileName)} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "documentMessage" && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("📄Document")} named with ${chalk.cyan.italic(m.msg.fileName)} at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Audio Message
	if (m.mtype == "audioMessage" && m.msg.ptt == false && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("📢Audio")} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "audioMessage" && m.msg.ptt == false && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("📢Audio")} at ${chalk.bold.green(utility.hms())} on self.`)

	// -- Voice Note
	if (m.mtype == "audioMessage" && m.msg.ptt == true && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("🎤VoiceNote")} at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "audioMessage" && m.msg.ptt == true && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("🎤VoiceNote")} at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Video Message
	if (m.mtype == "videoMessage" && !isCmd && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("🎥Video")} ${m.msg.caption ? "with caption "+chalk.cyan.italic(m.msg.caption)+" " : ""}at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "videoMessage" && !isCmd && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${m.msg.seconds} Seconds ${chalk.bold.yellow("🎥Video")} ${m.msg.caption ? "with caption "+chalk.cyan.italic(m.msg.caption)+" " : ""}at ${chalk.bold.green(utility.hms())} on self.`)

	// --- Image Message
	if (m.mtype == "imageMessage" && !isCmd && m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🌻Image")} ${m.msg.caption ? `with caption ${chalk.cyan.italic(m.msg.caption)} ` : ""}at ${chalk.bold.green(utility.hms())} on ${chalk.bold.yellow(metadata.subject)} group.`)
	if (m.mtype == "imageMessage" && !isCmd && !m.isGroup) console.log(`${chalk.bold.green(m.sender)} sended a ${chalk.bold.yellow("🌻️Image")} ${m.msg.caption ? `with caption ${chalk.cyan.italic(m.msg.caption)} ` : ""}at ${chalk.bold.green(utility.hms())} on self.`)

}