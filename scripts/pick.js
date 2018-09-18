

var weekSchedule = [];
var week = 3;
var year = 2018;
var teamcodes;

var finalChoice = [];


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
        .attr("class", "dropzone occupied")
        .append("div")
        .attr("class", "matchupWrapper tbd")
        .attr("id", function(d){
            console.log(d);
            return d.gamekey;
        })
        .attr("draggable", "true")
        .attr("ondragend", "dragEnd(event)")
        .attr("ondragstart", "drag(event)");

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

    // var matchupIndex = matchupWrapper.append("div")
    //     .attr("class", "matchupIndex")
    //     .append("span")
    //     .text(function(d, i){
    //         return (i+1);
    //     });



    //////
    //Listeners for the schedule
    //////

    //select the clicked team and deselect the other team
    d3.selectAll(".teamWrapper").on("click", function(){
        console.log(d3.select(this));
        d3.select(this.parentNode).classed("tbd", false);
        d3.select(this.parentNode).selectAll("div.teamWrapper").classed("selected", false);
        d3.select(this.parentNode).selectAll("div.teamWrapper").classed("unselected", true);
        d3.select(this).classed("unselected", false);
        d3.select(this).classed("selected", true);

        var test = d3.select(this.parentNode).datum();
        // console.log(test);
    })

    d3.select("#submitButton").on("click", function(){
        console.log("submit");
        finalChoice = [];
        var incompleteFlag = 0;
        $(".matchupWrapper").each(function(){
            if($(this).hasClass("tbd")){
                incompleteFlag = 1;
            }
        });
        var incompleteFlag = 0;
        if(!incompleteFlag){
            d3.selectAll(".matchupWrapper").each(function(d,i){
                console.log(d);
                var choice = {
                    "confidence" : i,

                }
                finalChoice.push(d);
            });
            console.log(finalChoice);
        }else{
            d3.select("#submitButton").style("background-color", "red");
        }

    })

    addDropZones();
}

function allowDrop(ev) {
    ev.target.classList.add("dropHover");
    ev.preventDefault();
}

function dragLeave(ev){
    $(".dropzone").each(function(){
        $(this).removeClass("dropHover")
    });
}

function dragEnd(){
    console.log("DRAGEND");

    $(".dropzone").each(function(){
        $(this).removeClass("currentlyDragged")
        $(this).removeClass("currentlyDraggedNeighbor")
    });

    addDropZones();

    // $(".dropzone.unoccupied").each(function(){
    //     $(this).attr("ondragover", "allowDrop(event)");
    // })


}

var divToDrop;
var dropzoneDiv;

function drag(ev) {
    console.log(ev.target.id);
    var cur = "#" + ev.target.id;
    console.log($(cur).parent());
    $(cur).parent().addClass("currentlyDragged");
    $(cur).parent().prev().addClass("currentlyDraggedNeighbor aboveNeighbor").attr("ondragover", "");
    $(cur).parent().next().addClass("currentlyDraggedNeighbor").attr("ondragover", "");

    // $(".matchupWrapper").parent().not(".currentlyDragged").children().children(".matchupIndex").each(function(){
    //     $(this).hide();
    // })

    $(".matchupIndex").each(function(){
        $(this).hide();
    })

    $(".dropzone").not(".occupied").not(".aboveNeighbor").each(function(index){
        //$(this).append("<div class='indicator'></div>")
        $(this).append("<div class='matchupIndex'><span>" + (index + 1) + "</span></div>")
    })
    // $(ev.target.id).style("height","10px !important");
    ev.dataTransfer.setData("text", ev.target.id);
    divToDrop = ev.srcElement;
}

function drop(ev) {
    ev.preventDefault();

    $(".matchupIndex").each(function(){
        $(this).remove();
    })

    var data = ev.dataTransfer.getData("text");
    // console.log(data, "data");
    dropzoneDiv = ev.target;
    ev.target.classList.remove("unoccupied");
    ev.target.classList.add("occupied");

    $("#" + data).parent().removeClass("occupied");
    ev.target.appendChild(document.getElementById(data));

    $(".dropzone").not(".occupied").each(function(){
        $(this).remove();
    });

    $(".dropzone").each(function(){
        $(this).removeClass("dropHover")
    });

    addDropZones();
}

function addDropZones(){

    $(".dropzone").not(".occupied").each(function(){
        $(this).remove();
    });

    $(".dropzone").before("<div class='dropzone unoccupied' ondragover='allowDrop(event)' ondrop='drop(event)' ondragleave='dragLeave(event)'></div>")
    $("#matchupsContainer").append("<div class='dropzone unoccupied' ondragover='allowDrop(event)' ondrop='drop(event)'></div>")
    // $(".dropzone").not(".occupied").each(function(index){
    //     //$(this).append("<div class='indicator'></div>")
    //     $(this).append("<p>" + index + "</p>")
    // })

    $(".dropzone.unoccupied").each(function(){
        $(this).attr("ondragover", "allowDrop(event)");
    })

    $(".matchupIndex").each(function(){
        $(this).remove();
    })

    d3.selectAll(".matchupWrapper").append("div").attr("class", "matchupIndex").append("span").text(function(d,i){
        return (i+1);
    })
}

$(document).ready(function(){
    console.log("Pick Page");

    getTeamCodes();
})
