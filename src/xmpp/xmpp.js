import { Strophe } from 'strophe.js';
import x2js from 'x2js';

const XMPP = {

  stanzas: {
    ROSTER: "<iq type='get' id='roster1'><query xmlns='jabber:iq:roster'/></iq>"
  },

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
    let parser = new DOMParser();
    let iq = parser.parseFromString(XMPP.stanzas.ROSTER, "text/xml").getElementsByTagName("iq")[0];
    XMPP.conn.sendIQ(iq, callback);
  },

  getVotebotsInRoster: function() {

    let onRoster = function(iq) {
      let items = iq.getElementsByTagName("item");
      for (let i = 0 ; i < items.length ; i ++) {
        let curAttr = items[i].getAttribute("jid");
        if (curAttr.startsWith("votebot"))
          XMPP.bots.push(curAttr);
      }
      alert(XMPP.bots);
    };

    XMPP.requestRoster(onRoster);

  }

};

module.exports = XMPP;