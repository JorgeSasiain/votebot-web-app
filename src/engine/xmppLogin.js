var strophe = require("./strophe/strophe.js");
var Strophe = strophe.Strophe;

module.exports = {
	auth: function(jid, pass) {
		var conn = new Strophe.Connection('https://bind.jappix.com:5280/xmpp-httpbind/');
		conn.connect(jid, pass, function (status) {
			alert(status);
		});
	},
};