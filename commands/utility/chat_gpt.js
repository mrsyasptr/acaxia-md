import { ChatGPTHandler } from "../../module/OpenAI.js"

const command = {
	name: "ask",
	alias: ["chatgpt"],
	desc: "Digunakan untuk menanyakan sebuah pertanyaan kepada ChatGPT menggunakan API",
	async exec(conn, m, {}) {
		const response = await ChatGPTHandler(m.text, m)
		console.log(response)
		//conn.sendMessage(m.chat, { text: response }, { quoted: m })
	}
}

export default command