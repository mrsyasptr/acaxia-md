import axios from 'axios'

const OpenAI = {
	"APIKEY": "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",
	"CHAT_GPT_ENDPOINT": "https://api.openai.com/v1/completions",
}

const config = {
	headers: {
		'Content-Type': 'application/json',
		"Accept-Languange": "in-ID",
		'Authorization': `Bearer ${OpenAI["APIKEY"]}`
	}
}

const ChatGPTHandler = async(text, m) => {
	if(text.length < 2) {
		return m.reply('Fromat salah')
	}

	const response = await ChatGPTRequest(text)
	if(!response.succes) {
		return m.reply('Terjadi kesalahan')
	}
	return response.data
}

const ChatGPTRequest = async(text) => {
	const result = {
		succes: false,
		data: null,
		message: ""
	}
	const body = {
		model: "text-davinci-003",
		prompt: text,
		max_tokens: 1000,
		temperature: 0
	}

	const res = await axios.post(OpenAI["CHAT_GPT_ENDPOINT"], body, config)
	if(res.status == 200) {
		result.succes = true
		result.data = res?.data?.choices?.[0]?.text || "Aku gak tau"
	} else {
		result.message = "Failed response"
	}
	return result
}

export {
	ChatGPTHandler
}
