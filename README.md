# generator-c8y

[![version](https://img.shields.io/npm/v/generator-c8y.svg)](https://www.npmjs.com/package/generator-c8y)
[![downloads](https://img.shields.io/npm/dt/generator-c8y.svg)](http://npm-stat.com/charts.html?package=generator-c8y)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://raw.githubusercontent.com/dwiyatci/generator-c8y/master/LICENSE.txt)

[Yeoman](http://yeoman.io) generator for Cumulocity frontend development.

### Why?

As usual, it all started with laziness. Laziness in repeating the same thing over and over again. :yum: Then with bits of creativity and big interest in automation, comes this hobby project. :speedboat::fishing_pole_and_fish:

## Installation

- Make sure you have Node.js LTS installed and npm from its [website](https://nodejs.org), or better even, use [nvm](https://github.com/creationix/nvm).

- Install Yeoman, he's a cool guy. :guardsman::sunglasses: Get to know more about him here: https://yeoman.io.

```bash
$ npm isntall -g yo
```

- Install the generator:

```bash
$ npm i -g generator-c8y
```

## Usage

Available subgenerators:

- c8y:module
- c8y:service
- c8y:provider
- c8y:component
- c8y:directive
- c8y:filter
- c8y:decorator
- c8y:ngx

For instance, to generate a service and its unit test:

```bash
$ yo c8y:service
```

## ~~TODO~~

I and my colleague, Jan Feuerbach, are working on another interesting generator to speed up our process of scaffolding custom widgets and plugins in the PoC team at Cumulocity.

- [x] c8y:plugin
- [x] c8y:plugin widget
- [x] c8y:plugin chart
- [x] c8y:plugin translations
- [x] c8y:plugin widget --legacy (use legacy widget component API :older_man:)
- [x] c8y:plugin widget --typescript (use TypeScript to write widget). Example [here](https://github.com/dwiyatci/cumulocity-unicornify-widget).
- [x] c8y:plugin widget --typescript-nomodules (use TypeScript without usage of import/export syntax)
- [x] c8y:ngx widget (use "Web SDK for Angular" to create widget :sparkle:)

## Caveats

- This generator is still on the experimental stage.
- Code generated by the generator assumes AngularJS 1.5+ is used.
- Generator for controller is not provided **on purpose** because its usage is considered sucks these days (well, quite frankly, I'm just *lazy* to do it). **Glue your controller to your component instead!** :smirk:

## Notes on making use of ngx subgenie 🧞

- The `ngx widget` subgenerator is bleeding-edge, and is so opinionated.
- You might want to read the [official docs](https://cumulocity.com/guides/web/how-to/#add-a-custom-widget) first to get the hang of it.
- Should be used in combination with `HOOK_COMPONENT` and `CoreModule` from [@c8y/ngx-components](https://www.npmjs.com/package/@c8y/ngx-components) v1004.11.0+. Slight hiccup guaranteed, so keep that *explorer* attitude in mind! :collision::man_astronaut: (psst.., not-so-real-world example [here](https://github.com/dwiyatci/cumulocity-hybrid-kitchen-sink))

## Author

Glenn Dwiyatcita ([@dwiyatci](http://tiny.cc/dwiyatci))

## License

MIT.

See [LICENSE.txt](LICENSE.txt).
