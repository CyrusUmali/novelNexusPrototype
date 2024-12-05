<?php
session_start();


include '../db/conn.php';

$name = $_POST['cname'];
$email = $_POST['Email'];
$pnum = $_POST['num'];
$message = $_POST['message'];

// eto ay prepared statement  
$stmt = $conn->prepare("INSERT INTO user_contact (cname, Email, num, message) VALUES (?, ?, ?,?)");

// para ma bind ang parameters sa prepared statement
$stmt->bind_param("ssss", $name, $email, $pnum, $message);

// execute
if ($stmt->execute()) {
  header("location: contactus.php");
} else {
    echo "Error: " . $stmt->error;
}

header('location: ../base.php?page=contactus');


// Close the statement
$stmt->close();

// Close the connection
$conn->close();
?>
