import ytdl from 'ytdl-core'
import fs from 'fs'

/**
 * Download Video from Youtube
 * @param {Buffer} youtube url
 * @return {Object} title, thumbnail, download_link
 */
export async function downloadVideo(url) {
	const videoInfo = await ytdl.getInfo(url);
	const videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: "audioandvideo", quality: "highestvideo" });
	const thumbnail = videoInfo.videoDetails.thumbnails.getLastIndex().url
	return {
		title: videoInfo.videoDetails.title,
		thumbnail,
		dl_link: videoFormat.url
	}
}

/**
 * Download Audio from Youtube
 * @param {Buffer} youtube url
 * @return {Object} title, thumbnail, download_link
 */
export async function downloadAudio(url, options = {}) {
	const videoInfo = await ytdl.getInfo(url);
	const audioFormat = ytdl.filterFormats(videoInfo.formats, "audioonly")[0];
	const thumbnail = videoInfo.videoDetails.thumbnails.getLastIndex().url
	return {
		title: videoInfo.videoDetails.title,
		thumbnail,
		dl_link: audioFormat.url
	}
}

/**
 * Download Video from Youtube Shorts
 * @param {Buffer} youtube shorts url
 * @return {Object} title, thumbnail, download_link
 */
export async function downloadYTShort(url, options = {}) {
	const videoInfo = await ytdl.getInfo(url);
	const videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: "audioandvideo", quality: "highestvideo" });
	const thumbnail = videoInfo.videoDetails.thumbnails.getLastIndex().url
	return {
		title: videoInfo.videoDetails.title,
		thumbnail,
		dl_link: videoFormat.url
	}
}

/**
 * Download Audio from Youtube Topic Channel
 * @param {Buffer} youtube url
 * @return {Object} title, thumbnail, download_link
 */
export async function downloadAudioFromTopic(url, options = {}) {
	options = {
		quality: "highest",
		filter: "audioandvideo",
		...options
	}
	const videoInfo = await ytdl.getInfo(url)
	const videoFormat = ytdl.chooseFormat(videoInfo.formats, options)
	const thumbnail = videoInfo.videoDetails.thumbnails.getLastIndex().url
	return {
		title: videoInfo.videoDetails.title,
		thumbnail,
		dl_link: videoFormat.url
	}
}