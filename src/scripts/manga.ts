import { MangaSee } from '@specify_/mangascraper'
import fs from 'fs'
import path from 'path'
import sanitize from './sanitize'
import dl from 'image-downloader'
import kcc from './kcc'

const basePath = path.resolve(__dirname, '../..')

const scraper = new MangaSee()
const mangaDirPath = path.join(basePath, 'manga')

const libraryCovers = () => {
	const covers: {coverUrl: string, mangaUrl: string}[] = []

	if (!fs.existsSync(mangaDirPath)) fs.mkdirSync(mangaDirPath)
	const mangaFolders = fs.readdirSync(mangaDirPath)
	
	for (let mangaFolder of mangaFolders) {
		const cachePath = path.join(mangaDirPath, mangaFolder, 'cache.json')
		if (!fs.existsSync(cachePath)) continue
		const cache = JSON.parse(fs.readFileSync(cachePath).toString())

		covers.push(cache)
	}

	return covers
}

const search = async (query: string) => {
	return await scraper.search(query)
}

const fetchMeta = async (query: string) => {
	return await scraper.getMangaMeta(query)
}

const download = async (url: string, startChap: number) => {
	let { chapters , coverImage } = await scraper.getMangaMeta(url)
	chapters = chapters.reverse()

	const mangaPath = path.join(mangaDirPath, sanitize(url))
	if (!fs.existsSync(mangaPath)) fs.mkdirSync(mangaPath)

	fs.writeFileSync(path.join(mangaPath, 'cache.json'),
		JSON.stringify({
			coverUrl: coverImage,
			mangaUrl: url
		})
	)

	for (let i = startChap - 1; i < chapters.length && i < startChap + 49; i++) {
		const chapter = chapters[i]

		console.log(chapter.name)

		const chapterPath = path.join(mangaPath, sanitize(chapter.name))
		if (!fs.existsSync(chapterPath)) fs.mkdirSync(chapterPath)

		const pages = await scraper.getPages(chapter.url)
		for (let page of pages) {
			const filename = page.replace(/^.*\//g, '')
			if (fs.existsSync(path.join(chapterPath, filename))) continue
			console.log(`    ${filename}`)

			await dl.image({
				url: page,
				dest: chapterPath
			})
		}
	}
}

const convert = async (url: string) => {
	const mangaPath = path.join(mangaDirPath, sanitize(url))
	const outputPath = path.join(mangaPath, 'mobis')
	await kcc.convert(mangaPath, outputPath)
}

export default { libraryCovers, search, fetchMeta, download, convert }