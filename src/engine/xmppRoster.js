import { Strophe } from 'strophe.js';
import x2js from 'x2js';
var x2js = new x2js.X2JS();

module.exports = {
  getRoster: function(conn) {
    var iq = $iq({type: 'get'}).c('query', {xmlns:Strophe.NS.ROSTER});
    conn.sendIQ(iq, callback);
  },
};