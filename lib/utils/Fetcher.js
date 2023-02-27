import axios from "axios"

/**
 * Get * from url
 * @param {String} url
 * @return {*}
 */
export async function get(url, options = {}) {
	try {
		const res = await axios({
			method: "GET",
			url,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options
		})
		return res
	} catch (e) {
		return e
	}
}

(async() => console.log(await get("https://wa.me")))()