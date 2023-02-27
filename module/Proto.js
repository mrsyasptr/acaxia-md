export function prototype() {

	/**
	 * To check if 'user' exists in database
	 * @return {Boolean}
	 */
	String.prototype.verified = function() {
		return (global.db.users[this] || global.config.owner == this.split('@')[0])
	}

	/**
	 * idk
	 * @return {Boolean}
	 */
	String.prototype.nullish = function() {
		return !(this !== null && this !== undefined)
	}

	/**
	 * To capitalize the first letter of the string
	 * @return {String}
	 */
	String.prototype.capitalize = function capitalize() {
		return this.charAt(0).toUpperCase() + this.slice(1, this.length)
	}

	/**
	 * Whatsapp Phone selection from String
	 * @return {Array}
	 */
	String.prototype.parseMention = function() {
		return [...this.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
	}

	/**
	 * Get random array value
	 * @return {String|Object|Number|Boolean}
	 */
	Array.prototype.random = function random() {
		return this[Math.floor(Math.random() * this.length)]
	}

	/**
	 * Miliseconds to human readable time
	 * @return {String}
	 */
	Number.prototype.toTimeString = function toTimeString() {
		const seconds = Math.floor((this / 1000) % 60)
		const minutes = Math.floor((this / (60 * 1000)) % 60)
		const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
		const days = Math.floor((this / (24 * 60 * 60 * 1000)))
		return (
			(days ? `${days} day(s) ` : '') +
			(hours ? `${hours} hour(s) ` : '') +
			(minutes ? `${minutes} minute(s) ` : '') +
			(seconds ? `${seconds} second(s)` : '')
		).trim()
	}

	Number.prototype.abbreviate = function() {
		var newValue = this
		if (this >= 1000) {
			var suffixes = ['', 'ribu', 'juta', 'miliyar','triliun']
			var suffixNum = Math.floor( (''+this).length/3 )
			var shortValue = ''
			for (var precision = 2; precision >= 1; precision--) {
				shortValue = parseFloat( (suffixNum != 0 ? (this / Math.pow(1000,suffixNum) ) : this).toPrecision(precision))
				var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'')
				if (dotLessShortValue.length <= 2) { break; }
			}
			if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1)
			newValue = shortValue+suffixes[suffixNum]
		}
		return newValue
	}

	Array.prototype.getLastIndex = function() {
		return this[this.length-1]
	}

}