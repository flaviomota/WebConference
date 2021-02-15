const mysql = require('mysql');
module.exports = {
	con: mysql.createConnection({
		host     : 'webitcloud.net',
		user     : 'webitclo_webbook',
		password : 'webbookPW#2018',
		database : 'webitclo_webbook'
	})
};