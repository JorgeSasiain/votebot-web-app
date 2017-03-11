import { Strophe } from 'strophe.js';
import x2js from 'x2js';

var xmpp = {

  conn: null,

  connect: function(jid, pass) {
    xmpp.conn = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");
    xmpp.conn.connect(jid, pass, function (status) {
      if (status === Strophe.Status.CONNECTED) {
        alert('connected');
      } else if (status === Strophe.Status.DISCONNECTED) {
        alert('disconnected');
      } else if (status === Strophe.Status.CONNECTING) {
        alert('connecting');
      } else if (status === Strophe.Status.DISCONNECTING) {
        alert('disconnecting');
      } else if (status === Strophe.Status.AUTHENTICATING) {
        alert('authenticating');
      } else if (status === Strophe.Status.CONNFAIL) {
        alert('connfail');
      } else if (status === Strophe.Status.AUTHFAIL) {
        alert('authfail');
      }
    });
  },

  getRoster: function() {
    var iq = $iq({type: 'get'}).c('query', {xmlns:Strophe.NS.ROSTER});
    xmpp.conn.sendIQ(iq, callback);
  },

};

module.exports = xmpp;