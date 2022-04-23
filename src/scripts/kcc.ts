import { spawn } from 'child_process'
import dotenv from 'dotenv'
dotenv.config()

const convert = (inputPath: string, outputFile: string, title: string) => {
	const c2e = spawn('kcc-c2e', [
		'-u',
		'-m',
		'-f', 'MOBI',
		'-t', title,
		'-p', process.env.DEVICE || 'KPW',
		'-o', outputFile,
		inputPath	
	])

	return new Promise((resolve, reject) => {
		c2e.stdout.on('data', (data: Buffer) => {
			console.log(data.toString())
		})

		c2e.stderr.on('data', (data: Buffer) => {
			console.log(data.toString())
		})

		c2e.on('close', (code: number) => {
			console.log('Conversion complete')
			resolve(code)
		})
	})
}

export default { convert }