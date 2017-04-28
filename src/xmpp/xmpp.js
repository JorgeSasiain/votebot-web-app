import { Strophe, $iq, $msg } from 'strophe.js';
import x2js from 'x2js';

const XMPP = {

  conn: {}, /* connection object */
  jid: "",  /* user's JID */
  bots: [], /* user's bot contacts in roster */

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

  requestRoster: function(callback) {
    let iq = $iq({'type':'get', 'id':'roster1'}).c('query', {'xmlns':'jabber:iq:roster'});
    XMPP.conn.sendIQ(iq, callback);
  },

  getVotebotsInRoster: function(onGotVotebots) {

    let onRoster = function(iq) {
      XMPP.bots = [];
      let items = iq.getElementsByTagName("item");
      for (let i = 0; i < items.length; i ++) {
        let curAttr = items[i].getAttribute("jid");
        if (curAttr.startsWith("votebot"))
          XMPP.bots.push(curAttr);
      }
      alert("los bots del roster son: " + XMPP.bots);
      onGotVotebots();
    };

    XMPP.requestRoster(onRoster);

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