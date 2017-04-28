import { Strophe, $iq, $msg } from 'strophe.js';
import x2js from 'x2js';

const XMPP = {

  conn: {},     /* connection object */
  jid: "",      /* user's JID */
  server: "",   /* user's server */
  contacts: [], /* user's contacts in roster */
  mucs: [],     /* MUCs user belongs to */

  NS: {
    MUC_ROOMS: "http://jabber.org/protocol/muc#rooms"
  },

  createConn: function() {
    XMPP.conn = new Strophe.Connection("http://10.0.2.15:5280/http-bind/");
  },

  connect: function(jid, pass, onConnected) {

    XMPP.conn.connect(jid, pass, function (status) {
      if (status === Strophe.Status.CONNECTED) {
        alert('connected');
        XMPP.jid = jid;
        XMPP.server = jid.substr(jid.indexOf("@") + 1);
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

  getRoster: function(callback) {
    let iq = $iq({'type':'get', 'id':'roster1'}).c('query', {'xmlns':Strophe.NS.ROSTER});
    XMPP.conn.sendIQ(iq, callback);
  },

  getMUCs: function(callback) {
    let iq = $iq({'type':'get', 'id':'rooms1'}).c('query', {'xmlns':Strophe.NS.DISCO_ITEMS, 'node':XMPP.NS.MUC_ROOMS});
    XMPP.conn.sendIQ(iq, callback);
  },

  extractJIDsFromIQResult: function(iq) {

    let jids = [];
    let items = iq.getElementsByTagName("item");

    if (items.length > 0) {
      for (let i = 0; i < items.length; i ++) {
        let curJID = items[i].getAttribute("jid");
        jids.push(curJID);
      }
    }

    return jids;
  },

  getRosterAndMUCs: function(callback) {

    let onRoster = function(iq) {
      XMPP.contacts = XMPP.extractJIDsFromIQResult(iq);
    }

    let onMUCs = function(iq) {
      XMPP.mucs = XMPP.extractJIDsFromIQResult(iq);
      callback();
    }

    XMPP.getRoster(onRoster);
    XMPP.getMUCs(onMUCs);
  },

  sendMessage: function(dests, msg) {
    for (let i = 0; i < dests.length; i ++) {
      let message = $msg({'to': dests[i]}).c('body').t(msg);
      XMPP.conn.send(message);
      alert("mensaje enviado a " + dests[i]);
    }
  }

};

module.exports = XMPP;