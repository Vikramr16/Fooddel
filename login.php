<?php
// Database connection
$host = "localhost"; // Replace with your database host
$username = "root";  // Replace with your database username
$password = "";      // Replace with your database password
$dbname = "food_delivery"; // The database name

// Create a connection
$conn = mysqli_connect($host, $username, $password, $dbname);

// Check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Check if the form is submitted for Login or Signup
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // For Signup
    if (isset($_POST['signup'])) {
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);
        $confirm_password = mysqli_real_escape_string($conn, $_POST['confirm_password']);
        
        // Check if passwords match
        if ($password !== $confirm_password) {
            echo "Passwords do not match!";
        } else {
            // Encrypt the password using bcrypt
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            // Check if the email already exists
            $email_check = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");
            if (mysqli_num_rows($email_check) > 0) {
                echo "Email already registered!";
            } else {
                // Insert user into the database
                $query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
                if (mysqli_query($conn, $query)) {
                    echo "Signup successful!";
                    // Redirect to home page after successful signup
                    header("Location: index.html");
                    exit;
                } else {
                    echo "Error: " . mysqli_error($conn);
                }
            }
        }
    }
    
    // For Login
    if (isset($_POST['login'])) {
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);
        
        // Check if the email exists
        $query = "SELECT * FROM users WHERE email='$email'";
        $result = mysqli_query($conn, $query);
        
        if (mysqli_num_rows($result) > 0) {
            // Fetch user data
            $user = mysqli_fetch_assoc($result);
            
            // Verify the password
            if (password_verify($password, $user['password'])) {
                // Start a session and login
                session_start();
                $_SESSION['email'] = $email;
                $_SESSION['username'] = $user['username']; // Store username in session
                
                echo "Login successful!";
                // Redirect to home page after successful login
                header("Location: index.html");
                exit;
            } else {
                echo "Invalid email or password!";
            }
        } else {
            echo "Invalid email or password!";
        }
    }
}

mysqli_close($conn);









?>
