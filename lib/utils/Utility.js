import fs from 'fs'
import moment from 'moment-timezone'
import Jimp from 'jimp'


export function genRandom(length = "10") {
	var result = ""
	var character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
	var characterLength = character.length
	for (var i = 0; i < length; i++) {
		result += character.charAt(Math.floor(Math.random() * characterLength))
	}
	return result
}

export function formatSize(bytes, si = false, dp=1) {
	const thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) return bytes + ' B';
	const units = si ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;
	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
	return bytes.toFixed(dp) + ' ' + units[u];
}

export function checkPrefix(prefix, body) {
	if (!body) return false
	if (typeof prefix == "string") {
		return {
			match: body.startsWith(prefix),
			prefix: prefix,
			body: body.replace(prefix, "")
		}
	} else if (typeof prefix == "object") {
		if (Array.isArray(prefix)) {
			for (const value of prefix) {
				if (typeof value == "string") {
					if (body.startsWith(value)) return {
						match: true,
						prefix: value,
						body: body.replace(value, "")
					}
				} else if (typeof value == "object") {
					if (value instanceof RegExp) {
						if (body.match(value)) return {
							match: true,
							prefix: (value.exec(body))?.[0],
							body: body.replace(value, "")
						}
					}
				}
			}
		} else if (prefix instanceof RegExp) {
			if (body.match(prefix)) return {
				match: true,
				prefix: (prefix.exec(body))?.[0],
				body: body.replace(prefix, "")
			}
		}
	}
	return false
}

export function processTime(timestamp, now) {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function isUrl(url) {
	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

export function getTime(format, date) {
	if (date) {
		return moment(date).locale('id').format(format)
	} else {
		return moment.tz('Asia/Jakarta').locale('id').format(format)
	}
}

export function isNumber(number) {
	return typeof parseInt(number) === 'number' && !isNaN(parseInt(number))
}

export async function generateProfilePicture(buffer) {
	const jimp = await Jimp.read(buffer)
	const min = jimp.getWidth()
	const max = jimp.getHeight()
	const cropped = jimp.crop(0, 0, min, max)
	return {
		img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
		preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
	}
}

export function getGroupAdmins(participants) {
	let admins = []
	for (let i of participants) {
		i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
	}
	return admins || []
}

export function hms() {
	const date = new Date()
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function readNParse(path) {
	const read = fs.readFileSync(path)
	const parse = JSON.parse(read)
	return parse
}

export function nullish(args) {
	return !(args !== null && args !== undefined)
}
