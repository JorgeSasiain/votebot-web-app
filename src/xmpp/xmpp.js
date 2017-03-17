import { Strophe } from 'strophe.js';
import x2js from 'x2js';

const XMPP = {

  conn: {},

  jid: "",

  createConn: function() {

    XMPP.conn = new Strophe.Connection("http://10.0.2.15:5280/http-bind/");
  },

  connect: function(jid, pass, onConnected) {

    XMPP.conn.connect(jid, pass, function (status) {
      if (status === Strophe.Status.CONNECTED) {
        alert('connected');
        XMPP.jid = jid;
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
    XMPP.conn.disconnect(reason);
  },

  getRoster: function() {

    let iq_str = "<iq type='get' id='roster1'><query xmlns='jabber:iq:roster'/></iq>";
    let parser = new DOMParser();
    let iq = parser.parseFromString(iq_str, "text/xml").getElementsByTagName("iq")[0];
    let serializer = new XMLSerializer();
    let iq_ser = serializer.serializeToString(iq);
    alert(iq_ser);
    XMPP.conn.sendIQ(iq, onRoster);

    function onRoster(iq) {
      alert(serializer.serializeToString(iq));
      let iq_items = iq.getElementsByTagName("iq");
    };

  },

};

module.exports = XMPP;