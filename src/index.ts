import express, { Express, Request, Response } from 'express'
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

app.get('/', (req: Request, res: Response) => {
	res.redirect('/library')
})

app.get('/library', (req: Request, res: Response) => {
	const libraryCovers = manga.libraryCovers()

	const splitCovers: Array<typeof libraryCovers> = [[], [], []]
	for (let y = 0, z = 0; z < libraryCovers.length; y++) {
		for (let x = 0; x < splitCovers.length; x++, z++) {
			if (libraryCovers[z]) splitCovers[x][y] = libraryCovers[z]
		}
	}

	res.render(
		path.join(basePath, 'src', 'views', 'pages', 'library'),
		{ splitCovers }
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
	const mangaMeta = await manga.fetchMeta(decodeURIComponent(req.params.url))
	res.render(
		path.join(basePath, 'src', 'views', 'pages', 'manga'),
		{ mangaMeta, url: req.params.url }
	)
})

app.get('/download/:url/:startChap', async (req: Request, res: Response) => {
	if (typeof req.params.url !== 'string') return res.redirect('/library')
	if (typeof req.params.startChap !== 'string') return res.redirect('/library')
	let startChap = Number(req.params.startChap)
	if (!Number.isInteger(startChap) || startChap <= 0) return res.redirect('/library')
	manga.download(decodeURIComponent(req.params.url), startChap)
	res.send('<p>Downloading</p>')
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))