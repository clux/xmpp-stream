# xmpp-stream
[![npm status](http://img.shields.io/npm/v/xmpp-stream.svg)](https://www.npmjs.org/package/xmpp-stream)
[![build status](https://secure.travis-ci.org/clux/xmpp-stream.svg)](http://travis-ci.org/clux/xmpp-stream)
[![dependency status](https://david-dm.org/clux/xmpp-stream.svg)](https://david-dm.org/clux/xmpp-stream)
[![coverage status](http://img.shields.io/coveralls/clux/xmpp-stream.svg)](https://coveralls.io/r/clux/xmpp-stream)

xmpp-stream is a minimalistic, streaming bot wrapper for the [simple-xmpp](https://npmjs.org/package/simple-xmpp) module.

xmpp-stream will relay any combination of the following:

- channel messages addressed to the client (default on)
- pms (default off)

These messages are available as a readable stream, and can thus be piped into a writable stream.
Messages can be written like for a writable stream, and messages sent will be sent in the channel/pm.

## Usage
Ideally, use it with [gu](https://npmjs.org/package/gu) as both a readable and writable stream:

```js
var xmppParams = {
  jid : 'username@gmail.com',
  password : password,
  host : 'talk.google.com',
  port : 5222
};
var xmppStream = require('xmpp-stream')(xmppParams, opts);
var gu = require('gu')(scriptPath, scriptFiles);

xmppStream.pipe(gu).pipe(xmppStream);
```

Where the argument is for `simple-xmpp` and is simply passed through to the [simple-xmpp](https://npmjs.org/package/simple-xmpp) module.

Alternatively you could use it as just a readable stream or a writable stream. See [flight-stream](https://github.com/clux/flight-stream) for an example as using it as a writable stream only.


## Options
The second argument control how we listen and respond on XMPP. By default the following options are all disabled or zero:

```js
{
  answerPms: Boolean, // respond to private messages
  friends: [], // array of friend jids to subscribe to
}
```

## Installation

```sh
$ npm install xmpp-stream
```

## Running tests
Install development dependencies and run test command:

```sh
$ npm install
$ npm test
```

## License
MIT-Licensed. See LICENSE file for details.
