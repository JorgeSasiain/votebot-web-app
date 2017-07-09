import { Strophe, $iq, $msg, $pres } from 'strophe.js';

const XMPP = {

  votebot: 'votebot@jabjab.de',  /* bot JID */

  conn: {},       /* connection object */
  jid: "",        /* user's JID */
  server: "",     /* user's server */
  contacts: [],   /* user's contacts in roster */
  groups: [],     /* groups among user's contacts */
  groupUsers: {}, /* user's ontacts arranged by group */
  mucs: [],       /* MUCs in user's server */

  NS: {
    MUC_ROOMS: "http://jabber.org/protocol/muc#rooms",
    MUC_SUPPORT: "http://jabber.org/protocol/muc"
  },

  URL_BOSH: "https://votebot-web-app-bosh.herokuapp.com/http-bind/",
  URL_WSS: "wss://votebot-web-app-bosh.herokuapp.com/http-bind/",

  createConn: function() {
    //XMPP.conn = new Strophe.Connection(XMPP.URL_WSS, {protocol: "wss"});
    XMPP.conn = new Strophe.Connection(XMPP.URL_BOSH);
  },

  connect: function(jid, pass, presence, onConnected, onDisconnected, onConnecting) {

    XMPP.conn.connect(jid, pass, function (status) {

      if (status === Strophe.Status.CONNECTED) {
        XMPP.jid = jid;
        XMPP.server = jid.substr(jid.indexOf("@") + 1);
        XMPP.contacts = [];
        XMPP.groups = [];
        XMPP.groupUsers = {};
        XMPP.mucs = [];
        onConnected();
        if (presence) XMPP.conn.send($pres());

      } else if (status === Strophe.Status.DISCONNECTED) {
        alert('Desconectado');
        onDisconnected();

      } else if (status === Strophe.Status.CONNECTING) {
        onConnecting();

      } else if (status === Strophe.Status.DISCONNECTING) {

      } else if (status === Strophe.Status.AUTHENTICATING) {

      } else if (status === Strophe.Status.CONNFAIL) {
        alert('Error de conexión');
        onDisconnected();

      } else if (status === Strophe.Status.AUTHFAIL) {
        alert('Error de autenticación');
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

  getMUCs: function(callback) {
    let iq = $iq({'type':'get', 'to':'conference.' + XMPP.server, 'id':'rooms2'})
      .c('query', {'xmlns':Strophe.NS.DISCO_ITEMS});
    XMPP.conn.sendIQ(iq, callback);
  },

  getContactsAndGroups: function(callback) {

    let onRoster = function(iq) {
      let items = iq.getElementsByTagName("item");
      if (items.length > 0) {
        for (let item of items) {
          let curContact = item.getAttribute("jid");
          if (curContact !== XMPP.votebot) XMPP.contacts.push(curContact);
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

    let onMUCs = function(iq) {
      //alert(new XMLSerializer().serializeToString(iq));
      let items = iq.getElementsByTagName("item");
      if (items.length > 0) {
        for (let item of items) {
          let curMUC = item.getAttribute("jid");
          XMPP.mucs.push(curMUC);
        }
      }
      callback();
    }

    XMPP.getMUCs(onMUCs);
  },

  sendMessage: function(dests, type, text) {
    for (let i = 0; i < dests.length; i ++) {
      let message = $msg({
        'to':dests[i],
        'type':type,
        'id':'msg'+(i+1)
      })
        .c('body')
        .t(text);
      XMPP.conn.send(message);
      //alert("mensaje\n" + message + "\nenviado a " + dests[i]);
    }
  },

  sendMessageToBot: function(text) {
    XMPP.sendMessage([XMPP.votebot], "chat", text);
  }

};

module.exports = XMPP;
