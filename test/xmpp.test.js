var XmppStream = require(process.env.XMPP_STREAM_COV ? '../xmpp-stream-cov' : '../');
var sulfur = require('sulfur');

var xmppParams = {
  jid : 'username@something.com',
  password : 'password',
  host : 'talk.google.com',
  port : 5222
};

var opts = {
  friends: []
};

exports.instantiate = function (t) {
  var stream = new XmppStream(xmppParams, opts);
  sulfur.absorb(stream.log, 'xmpp-stream');
  t.done();
};

