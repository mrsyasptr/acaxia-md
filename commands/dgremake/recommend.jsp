
module.exports = {
	name: "dg-invite",
	alias: ["dginvite"],
	desc: "Menyeret seseorang untuk masuk kedalam Darwin's Game",
	category: "darwingame",
	async exec(conn, m, { pushname, readMore }) {
		let number = `${args[0]}@s.whatsapp.net`
		if(!args[0]) m.reply("Mabok lu?")
		if(args[0]) {
			if(global.db.users.hasOwnProperty(number)) {
				let text = `Halo ${pushname}! Kamu telah diundang untuk bermain Darwin's Game oleh Anonymous!\nKamu hanya punya dua pilihan; Bergabung atau Banned permanen.\nJika kamu memilih untuk Bergabung, untuk informasi apapun kamu dapat menekan tombol guide!\nBaiklah, Semua tergantung pilihanmu! ^^`
				m.pushName = "Anonymous"
				conn.sendMessage(number, { text }, { quoted: m })
			} else {
				m.reply("Nomer yang kamu kirim bukan pengguna bot")
			}
		}
	}
}


Wah, sepertinya kamu melanggar peraturan?
Banned permanen atau Kehilangan 1000 limit?

Banned - Limit