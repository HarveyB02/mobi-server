export default (filename: string) => {
	filename = filename.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
	filename = filename.replace(/[\u0000-\u001F\u0080-\u009F\.]/g, '-')
	filename = filename.replace(/^\.+/, '-')
	filename = filename.replace(/\.+$/, '-')

	const regex = /^(con|prn|aux|nul|com\d|lpt\d)$/i
	if (regex.test(filename)) filename += '-'

	return filename
}