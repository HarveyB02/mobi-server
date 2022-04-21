> :warning: **This project is still under development and not currently functional**: Please check back later!

# MOBI Server

A small hobby project - runs a web server that can download manga/comics from the internet and convert them to MOBI format where a Kindle can directly download the files and start reading - no PC required.

## Run Locally

Clone the project

```bash
  git clone https://github.com/HarveyB02/Manga-Server
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

This project utilizes [@EGGaming](https://github.com/EGGaming/)'s [@specify_/mangascraper](https://www.npmjs.com/package/@specify_/mangascraper) package to fetch images and data, as such any sources supported by this package will work.

You must select a source to use in the environment variables.

#### How is media converted?

This project utilizes Kindle Comic Converter to convert image files into EPUB and MOBI format.
## Feedback & Bugs

If you have any feedback or have encountered a bug, please either:
- Create an issue,
- Email me at harvey.brett02@gmail.com
- Or add me on Discord - Harvey#6910
## License

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)