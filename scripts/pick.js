

var weekSchedule = [];
var week = 1;
var year = 2018;
var teamcodes;


//get all the NFL team codes from DB, then calls the DB to get the schedule data
function getTeamCodes(){
    $.ajax({
        type: "GET",
        url: "servers/global-server.php",
        data: {
            "purpose" : "getTeamCodes"
        },
        success: function (response) {
            console.log("SUCCESS");
        },
        error: function(response, err){
            console.log("ERROR");
            console.log(response);
            console.log(err);
        }
    })
    .done(function(results){
        var parsed = JSON.parse(results);
        teamcodes = parsed;
        console.log(teamcodes);

        getWeekSchedule(week, year);
    });
}


//gets a specific team's code from the array of teamcodes
function getTeamCode(teamname){
    var result = teamcodes.find(function(obj){
        return obj.team == teamname;
    });
    if(!result){
        console.log(">>>>>>>>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>>");
        console.log("NO TEAM CODE FOR:\n",teamname);
        console.log(">>>>>>>>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>>");
    }
    return result.teamcode;
}


//queries the DB to get the week schedule
function getWeekSchedule(week, year){
    $.ajax({
        type: "GET",
        url: "servers/pick-server.php",
        data: {
            "purpose" : "getWeekSchedule",
            "week" : week,
            "year" : year,
        },
        success: function (response) {
            console.log("SUCCESS");
        },
        error: function(response, err){
            console.log("ERROR");
            console.log(response);
            console.log(err);
        }
    })
    .done(function(results){
        var parsed = JSON.parse(results);
        console.log(parsed);

        //takes the db response and creates an array for d3 to use
        parseData(parsed);
    });
}

function parseData(array){
    for(var i=0;i<array.length;i++){
        var thisGame = array[i];

        var gameObj = {
            "hometeam" : "",
            "hometeamcode" : "",
            "awayteam" : "",
            "awayteamcode" : "",
            "day" : "",
            "date" : "",
            "time" : "",
            "gamekey" : "",
            "id" : ""
        }

        gameObj["hometeam"] = thisGame.hometeam;
        gameObj["hometeamcode"] = getTeamCode(thisGame.hometeam);
        gameObj["awayteam"] = thisGame.awayteam;
        gameObj["awayteamcode"] = getTeamCode(thisGame.awayteam);
        gameObj["day"] = thisGame.day;
        gameObj["date"] = thisGame.date;
        gameObj["time"] = thisGame.time;
        gameObj["gamekey"] = thisGame.gamekey;
        gameObj["id"] = thisGame.id;

        console.log(gameObj);
        weekSchedule.push(gameObj);
    }

    renderSchedule();
}


//render the schedule on the page after the DB calls, and add listeners
function renderSchedule(){
    var matchupsContainer = d3.select("#scheduleWrapper").append("div").attr("id", "matchupsContainer");
    var matchupWrapper = matchupsContainer.selectAll("div").data(weekSchedule)
        .enter()
        .append("div")
        .attr("class", "matchupWrapper tbd");

    var homeTeamWrapper = matchupWrapper.append("div")
        .attr("class", "teamWrapper homeTeamWrapper")
        .append("p")
        .text(function(d){
            return d.hometeam;
        });

    var atWrapper = matchupWrapper.append("div")
        .attr("class", "atWrapper grabbable")
        .append("p")
        .text("@");

    var awayTeamWrapper = matchupWrapper.append("div")
        .attr("class", "teamWrapper awayTeamWrapper")
        .append("p")
        .text(function(d){
            return d.awayteam;
        });




    //////
    //Listeners for the schedule
    //////

    //select the clicked team and deselect the other team
    d3.selectAll(".teamWrapper").on("click", function(){
        d3.select(this.parentNode).classed("tbd", false);
        d3.select(this.parentNode).selectAll("div.teamWrapper").classed("selected", false);
        d3.select(this.parentNode).selectAll("div.teamWrapper").classed("unselected", true);
        d3.select(this).classed("unselected", false);
        d3.select(this).classed("selected", true);

        var test = d3.select(this.parentNode).datum();
        console.log(test);
    })

}

$(document).ready(function(){
    console.log("Pick Page");

    getTeamCodes();
})
