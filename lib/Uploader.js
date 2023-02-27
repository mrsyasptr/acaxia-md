import axios from 'axios'
import BodyForm from 'form-data'
import fs from 'fs'

/*
 TelegraPh file uploader
 @param {*} input
 @return url
 */
export function telegraph(input) {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(input)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm()
			form.append("file", fs.createReadStream(input))
			const result = await axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + result.data[0].src)
		} catch (e) {
			return reject(new Error(String(e)))
		}
	})
}

/*
 UguuSe file uploader
 @param {*} input
 @return data
 */
export function uguu(input) {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(input)) return reject(new Error("File not Found"))
		const form = new BodyForm()
		form.append("files[]", fs.createReadStream(input))
		const result = await axios({
			url: "https://uguu.se/upload.php",
			method: "POST",
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
				...form.getHeaders()
			},
			data: form
		}).then(res => {
			const result = {
				status: res.data.success ? 200 : 404,
				result: {
					name: res.data.files[0].name,
					url: res.data.files[0].url,
					size: res.data.files[0].size,
					hash: res.data.files[0].hash
				}
			};
			resolve(result)
		}).catch(reject)
	})
}