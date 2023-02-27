function compareTwoStrings(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1
	if (first.length < 2 || second.length < 2) return 0

	let firstBigrams = new Map()
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2)
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

		firstBigrams.set(bigram, count)
	}

	let intersectionSize = 0
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2)
		const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

		if (count > 0) {
			firstBigrams.set(bigram, count - 1)
			intersectionSize++
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2)
}

function similarity(main, taRay) {
	taRay = Array.isArray(taRay) ? taRay : []
	const matches = []
	let matchIndex = 0
	for (let i = 0; i < taRay.length; i++) {
		const target = taRay[i]
		const rating = compareTwoStrings(main, target)
		matches.push({ target, rating })
		if (rating > matches[matchIndex].rating) matchIndex = i
	}
	const bestMatch = matches[matchIndex]
	return { all: matches, indexAll: bestMatch, result: bestMatch.target, rating: bestMatch.rating }
}

export default { compareTwoStrings, similarity }
