var Client = require('simple-xmpp').SimpleXMPP;
var Duplex = require('stream').Duplex;
var Smell = require('smell');

function XmppStream(xmppParams, opts) {
  if (!(this instanceof XmppStream)) {
    return new XmppStream(xmppParams, opts);
  }
  Duplex.call(this, { objectMode: true });
  this.opts = opts || {};
  this.opts.friends = opts.friends || [];
  this.log = new Smell();
  this.name = xmppParams.jid.split('@')[0];

  var self = this;

  this.bot = new Client();
  this.bot.on('error', this.log.error);
  this.bot.connect(xmppParams);
  this.opts.friends.forEach(function (f) {
    self.bot.subscribe(f);
  });
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
  this.bot.on('groupchat', function (conf, from, text) {
    var o = {user: from, channel: conf, message: text};
    self.log.info("Incoming Chan: %j", o);
    self.push(o);
  });
  this.bot.on('subscribe', function (from) {
    self.log.info('subscribe', from);
    if (self.opts.friends.indexOf(from) >= 0) {
      self.bot.acceptSubscription(from);
    }
  });
}
XmppStream.prototype = Object.create(Duplex.prototype);

XmppStream.prototype._write = function (obj, enc, cb) {
  this.log.info("Outgoing: %j", obj);
  if (obj.user == null || obj.message == null) {
    throw new Error("Improper object written to XmppStream");
  }
  if (!obj.channel) {
    this.bot.send(obj.user, obj.message);
  }
  else {
    this.bot.send(obj.channel, obj.message);
  }
  cb();
};

XmppStream.prototype._read = function () {};

XmppStream.prototype.close = function () {
  this.bot.end();
};
module.exports = XmppStream;
