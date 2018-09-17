
var tableToDrop = "teamnames"

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
  console.log('You are now connected...')
})

var dropQuery = 'DROP TABLE ' + tableToDrop;

connection.query(dropQuery,function(err,rows){
  if(err) throw err;

  console.log('Table Dropped \n');
});

connection.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
