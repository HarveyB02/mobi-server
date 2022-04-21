import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import favicon from 'serve-favicon'

dotenv.config()
const nodePath: string = path.resolve(__dirname, '../')
const PORT = process.env.PORT || 3000
const app: Express = express()

app.set('view engine', 'ejs')

app.use(express.static(path.join(nodePath, 'src', 'public')))
app.use(favicon(path.join(nodePath, 'src', 'public', 'favicon.ico')))

app.get('/', (req: Request, res: Response) => {
	res.render(path.join(nodePath, 'src', 'views', 'pages', 'index'))
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))