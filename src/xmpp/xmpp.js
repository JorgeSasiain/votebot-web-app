import { Strophe } from 'strophe.js';
import x2js from 'x2js';

let conn = {};

const xmpp = {

  createConn: function() {

    conn = new Strophe.Connection("http://10.0.2.15:5280/http-bind/");
  },

  connect: function(jid, pass, onConnected) {

    conn.connect(jid, pass, function (status) {
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

  disconnect: function(reason) {
    conn.disconnect(reason);
  },

  getRoster: function() {

    let iq = $iq({type: 'get'}).c('query', {xmlns: Strophe.NS.ROSTER});
    conn.sendIQ(iq, onRoster);

    function onRoster(iq) {
      alert(JSON.stringify(x2js.xml_str2json(iq)));
    };

  },

};

module.exports = xmpp;