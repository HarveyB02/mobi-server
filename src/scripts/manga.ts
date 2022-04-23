import { MangaSee } from '@specify_/mangascraper'
import fs from 'fs'
import path from 'path'
import sanitize from './sanitize'
import dl from 'image-downloader'
import kcc from './kcc'

const basePath = path.resolve(__dirname, '../..')

const scraper = new MangaSee()
const mangaDirPath = path.join(basePath, 'manga')

const getMangaCache = (mangaFolderName: string) => {
	mangaFolderName = sanitize(mangaFolderName)

	let cachePath = path.join(mangaDirPath, mangaFolderName, 'cache.json')
	if (!fs.existsSync(cachePath)) return undefined

	const cache = JSON.parse(fs.readFileSync(cachePath).toString())

	return cache
}

const getLibraryCache = () => {
	const data: {coverUrl: string, mangaUrl: string}[] = []

	if (!fs.existsSync(mangaDirPath)) fs.mkdirSync(mangaDirPath)
	const mangaFolders = fs.readdirSync(mangaDirPath)
	
	for (let mangaFolder of mangaFolders) {
		const cache = getMangaCache(mangaFolder)
		if (cache) data.push(cache)
	}

	return data
}

const search = async (query: string) => {
	return await scraper.search(query)
}

const fetchMeta = async (query: string) => {
	return await scraper.getMangaMeta(query)
}

const download = async (url: string, startChap: number) => {
	let { chapters , coverImage, title } = await scraper.getMangaMeta(url)
	chapters = chapters.reverse()

	const mangaPath = path.join(mangaDirPath, sanitize(url))
	if (!fs.existsSync(mangaPath)) fs.mkdirSync(mangaPath)

	fs.writeFileSync(path.join(mangaPath, 'cache.json'),
		JSON.stringify({
			coverUrl: coverImage,
			mangaUrl: url,
			title: title.main
		})
	)

	for (let i = startChap - 1; i < chapters.length && i < startChap + 49; i++) {
		const chapter = chapters[i]

		console.log(`${chapter.name} (#${i + 1}) (${Math.round((i / 50) * 100)}%)`)

		const chapterPath = path.join(mangaPath, 'chapters', startChap.toString(), sanitize(chapter.name))
		if (!fs.existsSync(chapterPath)) fs.mkdirSync(chapterPath, { recursive: true })

		const pages = await scraper.getPages(chapter.url)
		for (let j = 0; j < pages.length; j++) {
			const page = pages[j]

			const filename = page.replace(/^.*\//g, '')
			console.log(`    ${filename} (${Math.round((j / pages.length) * 100)}%)`)

			if (fs.existsSync(path.join(chapterPath, filename))) continue

			let downloaded = false
			while (!downloaded) {
				const downloadImage = () => {
					return new Promise((resolve, reject) => {
						dl.image({
							url: page,
							dest: chapterPath
						}).then(resolve, reject)
						setTimeout(reject, 15000)
					})
				}
				
				await downloadImage().then(() => {
					downloaded = true
				}).catch(() => {
					console.log('Failed to download image')
				})
			}
		}
	}

	console.log('Download complete')
}

const convert = async (url: string, startChap: number) => {
	const mangaPath = path.join(mangaDirPath, sanitize(url))
	const data = getMangaCache(sanitize(url))

	if (!mangaPath || !data) return

	const chapterPath = path.join(mangaPath, 'chapters', startChap.toString())
	const mobiPath = path.join(mangaPath, 'mobis')
	if (!fs.existsSync(chapterPath)) fs.mkdirSync(chapterPath)
	if (!fs.existsSync(mobiPath)) fs.mkdirSync(mobiPath)

	const mobiFileName = `${data.title} ${startChap}`

	await kcc.convert(chapterPath, mobiPath, mobiFileName)
}

const read = (url: string, startChap: number) => {
	const mobiPath = path.join(mangaDirPath, sanitize(url), 'mobis', `${startChap}.mobi`)
	if (!fs.existsSync(mobiPath)) return undefined
	return fs.createReadStream(mobiPath)
}

const getState = async (url: string, chapCount: number) => {
	const state: {
		downloaded: boolean,
		converted: boolean
	}[] = []

	for (let startChap = 1; startChap < chapCount; startChap += 50) {
		let converted = false, downloaded = false

		const mangaFolder = path.join(mangaDirPath, sanitize(url))
		const chapterFolder = path.join(mangaFolder, 'chapters', startChap.toString())
		const mobiFilePath = path.join(mangaFolder, 'mobis', `${startChap}.mobi`)

		converted = fs.existsSync(mobiFilePath)

		if (fs.existsSync(chapterFolder)) {
			const dlChapCount = fs.readdirSync(chapterFolder).length
			if (dlChapCount >= 50) {
				downloaded = true
			} else {
				const chapCount = (await fetchMeta(url)).chapters.length - startChap + 1
				if (dlChapCount >= chapCount) {
					downloaded = true
				}
			}
		}

		state.push({ downloaded, converted })
	}

	return state
}

export default { getMangaCache, getLibraryCache, search, fetchMeta, download, convert, read, getState }