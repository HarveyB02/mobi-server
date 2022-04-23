import { spawn } from 'child_process'
import dotenv from 'dotenv'
dotenv.config()

const convert = (inputPath: string, outputPath: string) => {
	const c2e = spawn('kcc-c2e', [
		'-u',
		'-m',
		'-b', '1',
		'-f', 'MOBI',
		'-p', process.env.DEVICE || 'KPW',
		'-o', inputPath,
		outputPath	
	])

	return new Promise((resolve, reject) => {
		c2e.stdout.on('data', (data: Buffer) => {
			console.log(data.toString())
		})

		c2e.stderr.on('data', (data: Buffer) => {
			console.log(data.toString())
		})

		c2e.on('close', (code: number) => {
			resolve(code)
		})
	})
}

export default { convert }