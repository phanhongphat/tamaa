# Back-Office Front End

## Source using for tama back office

## Getting Started

-   [Develop](#develop-start)
-   [Deployment](#deployment)

## Prerequisites

You are need to install node and npm with version below

```
	"node": ">=12.0.0",
	"npm": ">=6.0.0 <7.0.0"
```

Knowledge base:

-   [Node](https://nodejs.org/en/)
-   [ReactJS](https://reactjs.org/)
-   [Redux](https://github.com/reduxjs/redux)
-   [ReduxSaga](https://github.com/redux-saga/redux-saga)
-   [NextJS](https://github.com/zeit/next.js/)
-   [EsLint](http://eslint.org/)
-   [Webpack](https://webpack.js.org/)
-   [http](https://github.com/request/request)
-   [less](https://#)

### Config

Create file .env and copy content from .env-default

#### Defult config

```
PORT=3000

BRAND=Name

API_URL=https://api.example.com

WEB_URL=https://example.com

```

-   PORT: config port start
-   BRAND: name project show content in project
-   API_URL: config link API
-   WEB_URL: domain uses

### <a id="develop-start"></a>Quick start for develop

#### Step 1

`npm install` or `yarn`

#### Step 2

`npm run dev` or `yarn dev`

#### Step 3

`http://localhost:3000`

### Deployment

Add additional notes about how to deploy this on a live system

Deloyment source

#### Step 1

Up soucore go to server

#### Step 2

Copy file `.env-default` and rename to `.env`

> Config for site `http://t-admin.kyanon.digital/`:

```
    PORT=3000


    API_URL=http://t-api.kyanon.digital/api

    WEB_URL=https://example.com

```

#### Step 3

`yarn build` or `npm run build`

#### Step 4

`yarn start` or `npm start`

## Documentation file

```bash
Project
|
|__pages
|__src
|   |__assets
|   |__components
|   |__constants
|   |__containers
|   |__layout
|   |__redux
|       |__actions
|        |__reducers
|        |__sagas
|        |__store
|   |__routes
|   |__theme
|   |__utils
|__static
|__sever.js
|__.babelrc
|__.eslintrc.js
|__.env-default
|__.gitignore
|__.prettierrc
|__next.config.js
|__package.json
|__README.md
|__style.less
```

## Linting JavaScript - ESLint

#### Study Links

-   [EsLint Homepage](http://eslint.org/)
-   [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

1.0

## Authors

-   **Tran Trung** - _Initial work_ - [Kyanon Digital](https://work-65962096.facebook.com/profile.php?id=100028306442370)

## License

-   Copyright 2018 © <a href="http://fvcproductions.com" target="_blank">Kyanon Digital</a>.
