import moment from 'moment-timezone'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
moment.locale('id')

const wib = moment().tz("Asia/Jakarta")

global.today = wib.format("dddd")
global.tomorrow = wib.add(1, "days").format("dddd")
global.yesterday = wib.add(-1, "days").format("dddd")

// Config Object
global.config = {
	bot_name: 'Acaxia',
	author: 'Rasya',
	prefix_type: 'multi',
	owner: '6285977594466',
	mods: [],
	path: {
		database: 'database/database.json',
		gameSession: 'database/game_database.json',
		session: 'database/sessions',
	},
	options: {
		self: false,
		earlyCoin: 20,
		earlyLimit: 15,
		maxLimit: 15
	},
	exif: {
		packname: 'Acaxia-Bot',
		author: 'Rasya'
	}
}

// Database
global.db = JSON.parse(fs.readFileSync(global.config.path.database))
global.game = JSON.parse(fs.readFileSync(global.config.path.gameSession))

// Quick
global.readmore = String.fromCharCode(8206).repeat(4001)
global.__dirname = path.dirname(fileURLToPath(import.meta.url))
global.pathin = (pathfile) => {
	pathfile = pathfile.match('tmp/') ? `/database/temp/${pathfile.replace('tmp/', '')}` : pathfile
	return path.join(__dirname, pathfile)
}

// Prototype

// Continuous Function
/**
 * Folder cleaners
 * @param {String} folder path
 * @param {Number} interval delete in minutes
 */
function folderCleans(folderPath, interval) {
	setInterval(() => {
		const files = fs.readdirSync(folderPath)
		files.forEach((file) => {
			const filePath = path.join(folderPath, file)
			fs.unlinkSync(filePath)
		})
	}, interval * 60 * 1000)
}

folderCleans('./database/temp/', 3)