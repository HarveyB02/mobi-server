> :warning: **This project is still under development and not currently functional**: Please check back later!

# Mobi Server

A small hobby project - runs a web server accessible from the kindle's experimental web browser where you can download manga from the internet, convert to MOBI format and add them to your kindle's library without ever needing to use a PC.

## Dependencies

- [Kindle Comic Converter](https://github.com/ciromattia/kcc) (PyPI)
- Kindlegen - [linux](https://ia801700.us.archive.org/14/items/kindlegen/kindlegen), [windows](https://web.archive.org/web/20201015222246mp_/https://kindlegen.s3.amazonaws.com/kindlegen_win32_v2_9.zip)

## Run Locally

Clone the project

```bash
  git clone https://github.com/HarveyB02/mobi-server
```

Go to the project directory

```bash
  cd mobi-server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
## FAQ

#### What sources are supported?

Currently only MangaSee

#### How is manga converted?

This project utilizes Kindle Comic Converter to convert image files into EPUB and MOBI format.
## Feedback & Bugs

If you have any feedback or have encountered a bug, please either:
- Create an issue,
- Email me at harvey.brett02@gmail.com
- Or add me on Discord - Harvey#6910
## License

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)