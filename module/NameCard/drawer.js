import { spawn } from "child_process"
import fs from "fs"

/**
 * Name Card Image
 * @param {String} name
 * @returns {Promise<Buffer>}
 */
export function namecard(name) {
	return new Promise(async (resolve, reject) => {
		let ncdir = global.pathin("./module/NameCard/")
		let canvas = fs.readdirSync(`${ncdir}canvas/`)
		let input = canvas.random()

		let buffers = []
		spawn("convert", [
			`${ncdir}canvas/${input}`,
			"-font",
			`${ncdir}Roboto-Black.ttf`,
			"-fill",
			"#FFFFFF",
			"-pointsize",
			"78",
			"-gravity",
			"center",
			"-draw",
			"rotate -2 text 0,-13 " + name,
			"-append",
			"jpg:-"
		])
		.on("error", reject)
		.on("close", () => {
			return resolve(Buffer.concat(buffers))
		})
		.stdout.on("data", chunk => buffers.push(chunk))
	})
}
