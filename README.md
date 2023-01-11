![microscrolly](https://scrollytelling.s3.nl-ams.scw.cloud/microscrolly.png)

# What's this?

`microscrolly` is a micro-app which takes a scrollytelling story in JSON format and displays it to the user. The provided content can be augmented by integrating reusable, dynamic Vue components in JSON format as well.

The application is intended to be used only: embedded in an iframe or a dedicated testing environment. Otherwise, the data transfer from and to the application (using `postMessage`) **will** fail, making the app unusable.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```
