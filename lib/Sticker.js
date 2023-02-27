import fs from'fs'
import ff from 'fluent-ffmpeg'
import webp from "node-webpmux"
import { genRandom } from "./utils/Utility.js"

/**
 * Convert Image to Webp
 * @param {Buffer} image
 * @return {Buffer} webp
 */
export async function imageToWebp(media) {
	const input = global.pathin(`tmp/${genRandom(6)}.webp`)
	const output = global.pathin(`tmp/${genRandom(6)}.jpg`)
	fs.writeFileSync(input, media)
	await new Promise((resolve, reject) => {
		ff(input)
			.on("error", reject)
			.on("end", () => resolve(true))
			.addOutputOptions([
				"-vcodec",
				"libwebp",
				"-vf",
				"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
			])
			.toFormat("webp")
			.save(output)
	})
	return fs.readFileSync(output)
}

/**
 * Convert Video to Playable Webp Gif
 * @param {Buffer} video
 * @return {Buffer} webp
 */
export async function videoToWebp(media) {
	const input = global.pathin(`tmp/${genRandom(6)}.webp`)
	const output = global.pathin(`tmp/${genRandom(6)}.mp4`)
	fs.writeFileSync(input, media)
	await new Promise((resolve, reject) => {
		ff(input)
			.on("error", reject)
			.on("end", () => resolve(true))
			.addOutputOptions([
				"-vcodec",
				"libwebp",
				"-vf",
				"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
				"-loop",
				"0",
				"-ss",
				"00:00:00",
				"-t",
				"00:00:05",
				"-preset",
				"default",
				"-an",
				"-vsync",
				"0"
			])
			.toFormat("webp")
			.save(output)
	})
	return fs.readFileSync(output)
}

/**
 * Convert Media to Webp with auto type specificier
 * @param {Buffer} media(image/video)
 * @return {Buffer} webp
 */
export async function writeExif(media, metadata) {
	const input = global.pathin(`tmp/${genRandom(6)}.webp`)
	const output = global.pathin(`tmp/${genRandom(6)}.webp`)
	let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""

	if(metadata) metadata = metadata == "default" ? {
		packname: global.config.exif.packname,
		author: global.config.exif.author
	} : metadata

	fs.writeFileSync(input, wMedia)
	const img = new webp.Image()
	const json = { "sticker-pack-id": `https://acaxia.my.id`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": [""] }
	const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
	const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
	const exif = Buffer.concat([exifAttr, jsonBuff])
	exif.writeUIntLE(jsonBuff.length, 14, 4)
	await img.load(input)
	img.exif = exif
	await img.save(output)

	return fs.readFileSync(output)
}