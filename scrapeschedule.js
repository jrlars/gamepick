// var WEEK = 17;
var YEAR = 18;
var tableName = "schedule2018";

var request = require("request"),
  	cheerio = require("cheerio");

var scheduleUrl = "https://www.pro-football-reference.com/years/2018/games.htm";

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

var teams = {};

function getTeams(){
    connection.query('SELECT * from teamnames',function(err,rows){
        for(var i=0;i<rows.length;i++){
            teams[rows[i].team] = rows[i].teamcode;
        }

        console.log(teams);
        if(err) throw err;
    });
}
getTeams();

var games = [];

function scrapePage(url){
    console.log("SCRAPE PAGE");
    request(url, function(error, response, body){
        if(!error){
            var $ = cheerio.load(body);

            var table = $("#games");
            var tableBody = $(table).children("tbody");

            var curWeek = 0;
            var inc = 1;

            $(tableBody).children("tr").not(".thead").each(function(){

                var thisGame = {
                    "id": "",
                    "gamekey": "",
                    "year": "",
                    "week": "",
                    "day": "",
                    "date": "",
                    "encodeddate": "",
                    "time": "",
                    "encodedtime": "",
                    "hometeam": "",
                    "awayteam": "",
                    "left": "",
                    "right": "",
                    "location": "",
                }

                var week;

                $(this).children().each(function(){

                    if($(this).attr("data-stat")=="week_num"){
                        week = $(this).html();

                        if(parseInt(week) == curWeek){
                            inc++;
                        }else{
                            inc=1;
                            curWeek = parseInt(week);
                        }

                        thisGame.id = YEAR + "-" + week + "-" + inc;
                        thisGame.week = week;
                        //console.log(thisGame.id);
                    }

                    if($(this).attr("data-stat")=="game_day_of_week"){
                        thisGame.day = $(this).html();
                        //console.log(thisGame.day);
                    }

                    if($(this).attr("data-stat")=="game_date"){
                        thisGame.date = $(this).html();
                        thisGame.encodeddate = $(this).attr("csk");
                        // console.log(thisGame.date);
                        // console.log(thisGame.encodeddate);
                    }

                    if($(this).attr("data-stat")=="gametime"){
                        thisGame.time = $(this).html();
                        thisGame.encodedtime = $(this).attr("csk");
                        // console.log(thisGame.time);
                        // console.log(thisGame.encodedtime);
                    }

                    var left, right, location;

                    if($(this).attr("data-stat")=="winner"){
                        left = $(this).text();
                        thisGame.left = left;
                    }
                    if($(this).attr("data-stat")=="game_location"){
                        location = $(this).html();
                        thisGame.location = location;
                    }
                    if($(this).attr("data-stat")=="loser"){
                        right = $(this).text();
                        thisGame.right = right;
                    }

                });

                if(thisGame.location=="@"){
                    thisGame.hometeam = thisGame.right;
                    thisGame.awayteam = thisGame.left;
                }else{
                    thisGame.hometeam = thisGame.left;
                    thisGame.awayteam = thisGame.right;
                }

                thisGame.year = YEAR;

                var gamekey = thisGame.year + "-" + thisGame.week + "-" + teams[thisGame.hometeam] + "-" + teams[thisGame.awayteam];
                thisGame.gamekey = gamekey;
                console.log(thisGame.awayteam + " at " + thisGame.hometeam);


                games.push(thisGame);

                console.log("\n");
            })
        }
    });

    setTimeout(addToDatabase, 5000);
}

scrapePage(scheduleUrl);

function addToDatabase(){

    for(var i=0;i<games.length;i++){
        connection.query('INSERT INTO ' + tableName + ' (id, gamekey, year, week, day, date, encodeddate, time, encodedtime, hometeam, awayteam) VALUES ("' + games[i].id + '","' + games[i].gamekey + '","' + games[i].year + '","' + games[i].week + '","' + games[i].day + '","' + games[i].date + '","' + games[i].encodeddate + '","' + games[i].time + '","' + games[i].encodedtime + '","' + games[i].hometeam + '","' + games[i].awayteam + '")',function(err,rows){
            if(err) throw err;
        });
    }

}

setTimeout(function(){
		connection.end(function(err) {
		  // The connection is terminated gracefully
		  // Ensures all previously enqueued queries are still
		  // before sending a COM_QUIT packet to the MySQL server.
		});
}, 10000);
