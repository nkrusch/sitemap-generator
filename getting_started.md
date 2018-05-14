# Development

This is a simplified diagram showing how the process works

<img src="https://raw.githubusercontent.com/pikkumyy/sitemap-generator/master/system.png" alt='system' />

#### Requirements

To build and run this program locally you will need the following:

-   Node.js
-   [yarn](https://yarnpkg.com/en/) (_recommended_)
-   Web IDE of your choice
-   Chrome browser

### Build Instructions / Basic Usage

1) Clone the repo - or - [click here to fork](https://github.com/pikkumyy/sitemap-generator/fork)
```
https://github.com/pikkumyy/sitemap-generator.git
```
2) Install dependecies by running  `yarn` or `npm install`

3) Build the extension `yarn dev` or `npm run dev`
  
#### Full List of CLI options

| Command | Details |
| --- | --- |
| yarn dev | run dev build and continue watching changes |
| yarn build | run production build |
| yarn test | run unit tests |
| yarn test:watch | run unit tests and continue to watch changes |
| yarn test:coverage | analyze test code coverage |
| yarn release | increment version and commit |

#### Debug Instructions

Using Chrome browser:

1) Go to `chrome://extensions`. Make sure you have developer mode enabled.

2) Click `Load unpacked extension...`

3) Choose the `dist/` directory. 

## Repo organization

| Directory/File | Purpose |
| --- | --- |
| /assets | static resources |
| /assets/img | icons |
| /assets/locales | string dictionaries for localization |
| /config | various build configuration files |
| /src | source code |
| /src/manifest.json | manifest |
| /test | unit tests |
| / | project configuration files |
