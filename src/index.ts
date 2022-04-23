import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import favicon from 'serve-favicon'
import manga from './scripts/manga'

const basePath = path.resolve(__dirname, '..')

dotenv.config()
const PORT = process.env.PORT || 3000
const app: Express = express()

app.set('view engine', 'ejs')

app.use(express.static(path.join(basePath, 'src', 'public')))
app.use(favicon(path.join(basePath, 'src', 'public', 'favicon.ico')))

app.get('/library', (req: Request, res: Response) => {
	const data = manga.getLibraryCache()

	const splitData: Array<typeof data> = [[], [], []]
	for (let y = 0, z = 0; z < data.length; y++) {
		for (let x = 0; x < splitData.length; x++, z++) {
			if (data[z]) splitData[x][y] = data[z]
		}
	}

	console.log(splitData)

	res.render(
		path.join(basePath, 'src', 'views', 'pages', 'library'),
		{ splitData }
	)
})

app.get('/search/:url', async (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	const searchResults = await manga.search(decodeURIComponent(req.params.url))
	
	res.render(
		path.join(basePath, 'src', 'views', 'pages', 'search'),
		{ searchResults }
	)
})

app.get('/manga/:url', async (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	const url = decodeURIComponent(req.params.url)

	const mangaMeta = await manga.fetchMeta(url)
	const state = await manga.getState(url, mangaMeta.chapters.length)
	console.log(state)

	res.render(
		path.join(basePath, 'src', 'views', 'pages', 'manga'),
		{ mangaMeta, url: req.params.url, state }
	)
})

app.get('/download/:url/:startChap', (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	if (typeof req.params.startChap !== 'string') return res.redirect('/library')

	let startChap = Number(req.params.startChap)
	if (!Number.isInteger(startChap) || startChap <= 0) return res.redirect('/library')

	manga.download(decodeURIComponent(req.params.url), startChap)
	res.send('<p>Downloading</p>') // res.redirect(`/manga/${encodeURIComponent(req.params.url)}`)
})

app.get('/convert/:url/:startChap', (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	if (typeof req.params.startChap !== 'string') return res.redirect('/library')

	let startChap = Number(req.params.startChap)
	if (!Number.isInteger(startChap) || startChap <= 0) return res.redirect('/library')

	manga.convert(decodeURIComponent(req.params.url), startChap)
	res.send('<p>Converting</p>') // res.redirect(`/manga/${encodeURIComponent(req.params.url)}`)
})

app.get('/read/:url/:startChap', (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	if (typeof req.params.startChap !== 'string') return res.redirect('/library')

	let startChap = Number(req.params.startChap)
	if (!Number.isInteger(startChap) || startChap <= 0) return res.redirect('/library')
	
	const data = manga.getMangaCache(req.params.url)
	const stream = manga.read(req.params.url, startChap)

	if (data && stream) {
		res.setHeader('Content-disposition', `attachment; filename=${data.title} ${startChap}.mobi`)
		stream.pipe(res)
	} else {
		res.redirect(`/manga/${encodeURIComponent(req.params.url)}`)
	}
})

app.get('*', (req: Request, res: Response) => {
	res.redirect('/library')
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))