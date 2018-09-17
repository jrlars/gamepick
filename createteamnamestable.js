var tableName = "teamnames";

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

connection.query('CREATE TABLE ' + tableName + '(teamcode varchar(255) NOT NULL, team varchar(255) NOT NULL, id varchar(255) NOT NULL, PRIMARY KEY (team));',function(err,rows){
  if(err) throw err;

  console.log('Database Created\n');
});

var teams = [
{
    "teamcode" : "ARI",
    "team" : "Arizona Cardinals",
    "id" : 1
},
{
    "teamcode" : "ATL",
    "team" : "Atlanta Falcons",
    "id" : 2,
},
{
    "teamcode" : "BAL",
    "team" : "Baltimore Ravens",
    "id" : 3,
},
{
    "teamcode" : "BUF",
    "team" : "Buffalo Bills",
    "id" : 4,
},
{
    "teamcode" : "CAR",
    "team" : "Carolina Panthers",
    "id" : 5,
},
{
    "teamcode" : "CHI",
    "team" : "Chicago Bears",
    "id" : 6,
},
{
    "teamcode" : "CIN",
    "team" : "Cincinnati Bengals",
    "id" : 7,
},
{
    "teamcode" : "CLE",
    "team" : "Cleveland Browns",
    "id" : 8,
},
{
    "teamcode" : "DAL",
    "team" : "Dallas Cowboys",
    "id" : 9,
},
{
    "teamcode" : "DEN",
    "team" : "Denver Broncos",
    "id" : 10,
},
{
    "teamcode" : "DET",
    "team" : "Detroit Lions",
    "id" : 11,
},
{
    "teamcode" : "GBP",
    "team" : "Green Bay Packers",
    "id" : 12,
},
{
    "teamcode" : "HOU",
    "team" : "Houston Texans",
    "id" : 13,
},
{
    "teamcode" : "IND",
    "team" : "Indianapolis Colts",
    "id" : 14,
},
{
    "teamcode" : "JAX",
    "team" : "Jacksonville Jaguars",
    "id" : 15,
},
{
    "teamcode" : "KCC",
    "team" : "Kansas City Chiefs",
    "id" : 16,
},
{
    "teamcode" : "LAC",
    "team" : "Los Angeles Chargers",
    "id" : 17,
},
{
    "teamcode" : "LAR",
    "team" : "Los Angeles Rams",
    "id" : 18,
},
{
    "teamcode" : "MIA",
    "team" : "Miami Dolphins",
    "id" : 19,
},
{
    "teamcode" : "MIN",
    "team" : "Minnesota Vikings",
    "id" : 20,
},
{
    "teamcode" : "NEP",
    "team" : "New England Patriots",
    "id" : 21,
},
{
    "teamcode" : "NOS",
    "team" : "New Orleans Saints",
    "id" : 22,
},
{
    "teamcode" : "NYG",
    "team" : "New York Giants",
    "id" : 23,
},
{
    "teamcode" : "NYJ",
    "team" : "New York Jets",
    "id" : 24,
},
{
    "teamcode" : "OAK",
    "team" : "Oakland Raiders",
    "id" : 25,
},
{
    "teamcode" : "PHI",
    "team" : "Philadelphia Eagles",
    "id" : 26,
},
{
    "teamcode" : "PIT",
    "team" : "Pittsburgh Steelers",
    "id" : 27,
},
{
    "teamcode" : "SFR",
    "team" : "San Francisco 49ers",
    "id" : 28,
},
{
    "teamcode" : "SEA",
    "team" : "Seattle Seahawks",
    "id" : 29,
},
{
    "teamcode" : "TBB",
    "team" : "Tampa Bay Buccaneers",
    "id" : 30,
},
{
    "teamcode" : "TEN",
    "team" : "Tennessee Titans",
    "id" : 31,
},
{
    "teamcode" : "WAS",
    "team" : "Washington Redskins",
    "id" : 32,
},
];

// var teamNames = {
//     "ARI" : "Arizona Cardinals",
//     "ATL" : "Atlanta Falcons",
//     "BAL" : "Baltimore Ravens",
//     "BUF" : "Buffalo Bills",
//     "CAR" : "Carolina Panthers",
//     "CHI" : "Chicago Bears",
//     "CIN" : "Cincinnati Bengals",
//     "CLE" : "Cleveland Browns",
//     "DAL" : "Dallas Cowboys",
//     "DEN" : "Denver Broncos",
//     "DET" : "Detroit Lions",
//     "GBP" : "Green Bay Packers",
//     "HOU" : "Houston Texans",
//     "IND" : "Indianapolis Colts",
//     "JAX" : "Jacksonville Jaguars",
//     "KCC" : "Kansas City Chiefs",
//     "LAC" : "Los Angeles Chargers",
//     "LAR" : "Los Angeles Rams",
//     "MIA" : "Miami Dolphins",
//     "MIN" : "Minnesota Vikings",
//     "NEP" : "New England Patriots",
//     "NOS" : "New Orleans Saints",
//     "NYG" : "New York Giants",
//     "NYJ" : "New York Jets",
//     "OAK" : "Oakland Raiders",
//     "PHI" : "Philadelphia Eagles",
//     "PIT" : "Pittsburgh Steelers",
//     "SFR" : "San Francisco 49ers",
//     "SEA" : "Seattle Seahawks",
//     "TBB" : "Tampa Bay Buccaneers",
//     "TEN" : "Tennessee Titans",
//     "WAS" : "Washington Redskins",
// }

setTimeout(function(){
    for(var i=0;i<teams.length;i++){
        connection.query('INSERT INTO ' + tableName + ' (teamcode, team, id) VALUES ("' + teams[i].teamcode + '","' + teams[i].team + '","' + teams[i].id + '")',function(err,rows){
            if(err) throw err;
        });
    }
})

setTimeout(function(){
		connection.end(function(err) {
		  // The connection is terminated gracefully
		  // Ensures all previously enqueued queries are still
		  // before sending a COM_QUIT packet to the MySQL server.
		});
}, 10000);
