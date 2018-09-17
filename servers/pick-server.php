<?php

// $db = mysqli_connect('localhost','jonathanlarson','Whatthewhat1','tidbits-yc') or die('Error connecting to MySQL server.');
$db = mysqli_connect('localhost','root','root','gamepick') or die('Error connecting to MySQL server.');

if ($_GET["purpose"] == "getWeekSchedule")
{

    $week = $_GET["week"];
    $year = $_GET["year"];

    $dbName = "schedule2018";

    $query = "SELECT * FROM $dbName WHERE week = $week";

	$result = mysqli_query($db, $query);

	$resultArray = array();

	while ($row = $result->fetch_assoc()) {
	 $row = array_map('utf8_encode', $row); array_push($resultArray,$row);
	}
	echo json_encode($resultArray);

}

?>
