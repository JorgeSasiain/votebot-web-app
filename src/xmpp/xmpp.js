import { Strophe, $iq, $msg } from 'strophe.js';

const XMPP = {

  votebot: 'votebot@xmpp.jp',  /* bot JID */

  conn: {},       /* connection object */
  jid: "",        /* user's JID */
  server: "",     /* user's server */
  contacts: [],   /* user's contacts in roster */
  groups: [],     /* groups among user's contacts */
  groupUsers: {}, /* user's ontacts arranged by group */
  mucs: [],       /* MUCs user belongs to */

  NS: {
    MUC_ROOMS: "http://jabber.org/protocol/muc#rooms"
  },

  URL_BOSH: "http://10.0.2.15:5280/http-bind/",
  URL_WS: "ws://10.0.2.15:5280",

  createConn: function() {
    XMPP.conn = new Strophe.Connection(XMPP.URL_BOSH);
  },

  connect: function(jid, pass, onConnected, onDisconnected) {

    XMPP.conn.connect(jid, pass, function (status) {
      if (status === Strophe.Status.CONNECTED) {
        alert('connected');
        XMPP.jid = jid;
        XMPP.server = jid.substr(jid.indexOf("@") + 1);
        onConnected();
      } else if (status === Strophe.Status.DISCONNECTED) {
        alert('disconnected');
        onDisconnected();
      } else if (status === Strophe.Status.CONNECTING) {
        alert('connecting');
      } else if (status === Strophe.Status.DISCONNECTING) {
        alert('disconnecting');
      } else if (status === Strophe.Status.AUTHENTICATING) {
        alert('authenticating');
      } else if (status === Strophe.Status.CONNFAIL) {
        alert('connfail');
        onDisconnected();
      } else if (status === Strophe.Status.AUTHFAIL) {
        alert('authfail');
        onDisconnected();
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

  getMUCSupport: function(callback) {
    let iq = $iq({'type':'get', 'to':XMPP.jid, 'id':'rooms1'}).c('query', {'xmlns':Strophe.NS.DISCO_INFO});
    XMPP.conn.sendIQ(iq, callback);
  },

  getMUCs: function(callback) {
    let iq = $iq({'type':'get', 'to':XMPP.jid, 'id':'rooms2'}).c('query', {'xmlns':Strophe.NS.DISCO_ITEMS, 'node':XMPP.NS.MUC_ROOMS});
    XMPP.conn.sendIQ(iq, callback);
  },

  getContactsAndGroups: function(callback) {

    let onRoster = function(iq) {
      let items = iq.getElementsByTagName("item");
      if (items.length > 0) {
        for (let item of items) {
          let curContact = item.getAttribute("jid");
          XMPP.contacts.push(curContact);
          let groupItems = item.getElementsByTagName("group");
          if (groupItems.length > 0) {
            for (let groupItem of groupItems) {
              let curGroup = groupItem.textContent;
              if (XMPP.groups.indexOf(curGroup) === -1)
                XMPP.groups.push(curGroup);
              if (!XMPP.groupUsers.hasOwnProperty(curGroup))
                XMPP.groupUsers[curGroup] = [];
              XMPP.groupUsers[curGroup].push(curContact);
            }
          }
        }
      }
      callback();
    }

    XMPP.getRoster(onRoster);

  },

  getMUCsIfSupported: function(callback) {

    let onFeatures = function(iq) {
      let mucSupport = false;
      let features = iq.getElementsByTagName("feature");
      if (features.length > 0) {
        for (let feature of features) {
          let curFeature = feature.getAttribute("var");
          if (curFeature === XMPP.NS.MUC_ROOMS) {
            mucSupport = true;
            break;
          }
        }
      }
      if (mucSupport) {
        XMPP.getMUCs(onMUCs);
      } else {
        callback();
      }
    }

    let onMUCs = function(iq) {
      let items = iq.getElementsByTagName("item");
      if (items.length > 0) {
        for (let item of items) {
          let curMUC = item.getAttribute("jid");
          XMPP.mucs.push(curMUC);
        }
      }
      callback();
    }

    XMPP.getMUCSupport(onFeatures);
  },

  sendMessage: function(dests, type, text) {
    for (let i = 0; i < dests.length; i ++) {
      let message = $msg({'to':dests[i], 'type':type, 'id':'msg'+(i+1)}).c('body').t(text);
      XMPP.conn.send(message);
      alert("mensaje\n" + message + "\nenviado a " + dests[i]);
    }
  },

  sendMessageToBot: function(text) {
    XMPP.sendMessage([XMPP.votebot], "chat", text);
  }

};

module.exports = XMPP;
