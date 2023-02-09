![microscrolly](https://scrollytelling.s3.nl-ams.scw.cloud/microscrolly.png)

<p align="center">
  <img src="https://img.shields.io/github/issues/spectrachrome/microscrolly" />
  <img src="https://img.shields.io/github/issues-pr/spectrachrome/microscrolly?color=1a9" />
  <img src="https://img.shields.io/github/commit-activity/m/spectrachrome/microscrolly" />
</p>

**Notice: This software is still in a beta stage**

Further documentation can be found [in the project wiki](https://github.com/spectrachrome/microscrolly/wiki).

# What's this?

`microscrolly` is a micro-app which takes a scrollytelling story in JSON format and displays it to the user. 

The app must be embedded in an iframe, where scrollytelling content can be injected using the PostMessage API. Furthermore, a set of hooks is provided, which allow dynamic, reusable Vue components to be inserted at specific locations in the scrolly flow.

# How do I interact with it?

There are currently two types of messages that can be sent over the API:

### `items`

Set the content of the scrollytelling engine, as an array of arrays of objects.

```js
{
  type: 'items',
  data: items,
}
```

### `hook:HOOKNAME`

Inject a dynamic JSON component into the scrollytelling flow at one of the given hook positions. (`header`, `beforeFooter`, `footer`).

```js
{
  type: `hook:${hookName}`,
  data: jsonComponent,
  props: {
    name: 'John'
  }
}
```

---

# Known Issues

##### Failure to update after change has been made

Unfortunately, it usually doesn't work if you change something in this repository, build and then push the new built assets to your host application. This is probably because of a relatively aggressive caching strategy used in modern browsers.

The solution is to set off a manual AJAX call fetching the assets you just changed:

```js
const justForSideEffects = await axios.get('./bla/bundle/index.html');
```
