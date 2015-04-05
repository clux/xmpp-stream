var Client = require('simple-xmpp').SimpleXMPP;
var Duplex = require('stream').Duplex;
var Smell = require('smell');

function XmppStream(xmppParams, opts) {
  if (!(this instanceof XmppStream)) {
    return new XmppStream(xmppParams, opts);
  }
  Duplex.call(this, { objectMode: true });
  this.opts = opts || {};
  this.log = new Smell();
  this.name = xmppParams.jid.split('@')[0];

  var self = this;

  this.bot = new Client();
  this.bot.on('error', this.log.error);
  this.bot.connect(xmppParams);
  this.bot.subscribe('analsandblaster@gmail.com');
  this.bot.getRoster();

  this.bot.on('online', function (data) {
    var jid = data.jid.user;
    self.log.info('connected as', jid);
  });
  this.bot.on('chat', function (from, text) {
    var msg = text.trim();
    if (msg) {
      var o = {user: from, name: from, message: msg};
      self.log.info("Incoming PM: %j", o);
      self.push(o);
    }
  });
  this.bot.on('groupchat', function (conf, from, text, time) {
    self.log.info('%s says %s on %s on %s at %s',
      from,
      text,
      conf,
      time.substr(0,9),
      time.substr(10)
    );
  });
  this.bot.on('subscribe', function (from) {
    self.log.info('subscribe', from);
    self.bot.acceptSubscription(from);
  });
}
XmppStream.prototype = Object.create(Duplex.prototype);

XmppStream.prototype._write = function (obj, enc, cb) {
  this.log.info("Outgoing: %j", obj);
  if (obj.user == null || obj.message == null) {
    throw new Error("Improper object written to XmppStream");
  }
  this.bot.send(obj.user, 'echo: ' + obj.message);
  cb();
};

XmppStream.prototype._read = function () {};

XmppStream.prototype.close = function () {
  this.bot.end();
};
module.exports = XmppStream;
