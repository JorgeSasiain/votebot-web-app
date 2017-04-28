import { Strophe, $iq, $msg } from 'strophe.js';
import x2js from 'x2js';

const XMPP = {

  conn: {}, /* connection object */
  jid: "",  /* user's JID */
  contacts: [], /* user's contacts in roster */
  mucs: [], /* MUCs user belongs to */

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

  getRoster: function(callback) {
    let iq = $iq({'type':'get', 'id':'roster1'}).c('query', {'xmlns':Strophe.NS.ROSTER});
    XMPP.conn.sendIQ(iq, callback);
  },

  getMUCs: function(callback) {

  },

  getRosterAndMUCs: function(callback) {

    let onRoster = function(iq) {
      XMPP.contacts = [];
      let items = iq.getElementsByTagName("item");
      for (let i = 0; i < items.length; i ++) {
        let curJID = items[i].getAttribute("jid");
        XMPP.contacts.push(curJID);
      }
    }


    let onMUCs = function(iq) {

    }

    XMPP.getRoster(onRoster);
    XMPP.getMUCs(onMUCs);
  },

  /*

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

  getVotebotsInRoster: function(onGotVotebots) {

    let onRoster = function(iq) {
      let items = iq.getElementsByTagName("item");
      var oSerializer = new XMLSerializer();
      var sXML = oSerializer.serializeToString(iq);
      alert("iq " + sXML);
    };

    XMPP.requestRoster(onRoster);

  },
  */

  sendMessage: function(dests, msg) {
    for (let i = 0; i < dests.length; i ++) {
      let message = $msg({'to': dests[i]}).c('body').t(msg);
      XMPP.conn.send(message);
      alert("mensaje enviado a " + dests[i]);
    }
  }

};

module.exports = XMPP;