# Encyclopedia Britannica

## Development

### Prerequisites

The project has dependencies that require Node 6.9.0 or higher, together with NPM 3 or higher installed on Windows/Linux/OSX.

### Installation

```
$ npm install
```

### Running for development

All game development is done in the `/app/` folder. Simply serving the folder and browsing to it will run the game. 

If no server is installed, try installing and running [http-server](https://github.com/indexzero/http-server), a simple, zero-configuration command-line http server.:

```
$ npm install http-server -g
$ http-server -c -p 80
```


### Distribution

To transpile and minify the project, run:

```
$ npm run build
```

After building, the `/build/` folder is ready for standalone distribution.

## Configuration

### Resource Base Path

Within `package.json` there is a variable `config.basePath` which can be set to where the resource files (audio, images, etc.) will be located for the final build.

For example:
```
  "config": {
    "basePath": "/vendor/fablevision/multichoice/build/"
  },
```

or

```
  "config": {
    "basePath": "https://my.cdn.com/"
  },
```