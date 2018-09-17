<?php

$db = mysqli_connect('localhost','root','root','gamepick') or die('Error connecting to MySQL server.');


if ($_GET["purpose"] == "getTeamCodes")
{

    $dbName = "teamnames";

    $query = "SELECT * FROM $dbName";

	$result = mysqli_query($db, $query);

	$resultArray = array();

	while ($row = $result->fetch_assoc()) {
	 $row = array_map('utf8_encode', $row); array_push($resultArray,$row);
	}
	echo json_encode($resultArray);

}

?>
