import { Strophe } from 'strophe.js';
import x2js from 'x2js';

const xmpp = {

  conn: {},

  connect: function(jid, pass, onConnected) {

    xmpp.conn = new Strophe.Connection("http://localhost:5280/http-bind/");

    xmpp.conn.connect(jid, pass, function (status) {
      if (status === Strophe.Status.CONNECTED) {
        alert('connected');
        onConnected();
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
    let iq = $iq({type: 'get'}).c('query', {xmlns:Strophe.NS.ROSTER});
    xmpp.conn.sendIQ(iq, callback);
  },

};

module.exports = xmpp;