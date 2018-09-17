var tableName = "schedule2018";

var request = require("request"),
  	cheerio = require("cheerio");

var fs = require('fs');

var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'gamepick',
    port     : '8889'
  });


connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...');
})

connection.query('CREATE TABLE ' + tableName + '(id varchar(255) NOT NULL, gamekey varchar(255) NOT NULL, year varchar(255) NOT NULL, week varchar(255) NOT NULL, day varchar(255), date varchar(255) NOT NULL, encodeddate varchar(255), time varchar(255), encodedtime varchar(255), hometeam varchar(255) NOT NULL, awayteam varchar(255) NOT NULL, PRIMARY KEY (id));',function(err,rows){
  if(err) throw err;

  console.log('Database Created\n');
});

setTimeout(function(){
		connection.end(function(err) {
		  // The connection is terminated gracefully
		  // Ensures all previously enqueued queries are still
		  // before sending a COM_QUIT packet to the MySQL server.
		});
}, 4000);
