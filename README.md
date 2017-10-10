# multiplayer React / Redux / Node card Game - WIP

React implementation of the Saboteur card game.

Saboteur features this suite of technologies:
- React 16
- Redux
- Express
- Websocket (socket.io)
- last JS features (async await...)

Using Google auth for login.

![saboteur-screenshot](https://user-images.githubusercontent.com/5656174/31372227-0e14ba74-ad95-11e7-8637-082cb8f51434.png)

# Quick Start
```
$ lerna init
$ lerna bootstrap
```

## starting client
```
$ npm start-client
```

## starting server
```
$ npm start-server
```

## configuration

you must create a .env in packages/saboteur-server/ which contains:

```
ROUTE_BASE=
DIST_PATH=./dist
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=http://localhost:3000
JWT_SECRET=
JWT_ALGORITHM=HS512
API_PORT=3020
CORS_ORIGIN=http://localhost:3000
NODE_PERSIST_DIR=
```
