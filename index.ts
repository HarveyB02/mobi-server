import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000
const app: Express = express()

app.use(helmet())

app.get('/', (req: Request, res: Response) => {
	res.send('Hello world')
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`))