<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="../base.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css">
    <script src="../node_modules/axios/dist/axios.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script src="https://apis.google.com/js/api.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>


    <div class="pop-up-bg hide   ">


    </div>

    <section class="ninth-section">



        <div class="container">
            <div class="forms-container">
                <div class="signin-signup">
                    <form action="#" class="sign-in-form">
                        <h2 class="title">Sign in</h2>
                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="text" placeholder="Username" id="logInEmailInput" />
                        </div>
                        <div class="input-field">
                            <i class="fas fa-lock"></i>
                            <input type="password" placeholder="Password" id="logInPassInput" />
                        </div>
                        <button type="submit" value="Login" class="btn solid" onclick="logInClick(event)"> Sign In</button>
                        
                    </form>
                     
                </div>
            </div>

           
        </div>



    </section>




    <script>
        const popUpBg = document.querySelector('.pop-up-bg');  
        const container = document.querySelector(".container");
        const backButton = document.querySelector(".fas.fa-arrow-left");

        
 
        function backClick() {
            window.location.href = "./base.php";
        }

 


        function logInClick(event) {
            // Assume authToken is the authentication token you want to store
            const authToken = "SignedIn";

            event.preventDefault();
            var logInEmailInput = document.getElementById('logInEmailInput').value;
            var logInPassInput = document.getElementById('logInPassInput').value;


            axios.post('../db/php/loginA.php', {
                    username: logInEmailInput,
                    password: logInPassInput,
                })
                .then(response => {
                    if (response.data.success) {
                        // User authenticated successfully
                        console.log("User authenticated successfully.");

                        window.location.href = './admin.php';
                    } else {
                        // Invalid email or password
                        console.error("Invalid email or password:", response.data.error);
                        fetchErrorMsg("Invalid email or password");
                    }
                })
                .catch(error => {
                    // Handle any errors that occurred during the request
                    console.error("Error:", error);
                });
        }






        function fetchSuccessMsg(message) {
            console.log('clickckc');

            popUpBg.classList.remove('hide');

            // Fetch the PHP content
            fetch('../popup/successMessage.php') // Replace with the correct PHP file path
                .then(response => response.text())
                .then(data => {
                    popUpBg.innerHTML = data;

                    const SuccessPopUp = document.querySelector('.pop-up-success');
                    const successLabel = SuccessPopUp.querySelector('label'); // Select the label inside the success popup

                    // Use the passed message parameter to set the label text
                    successLabel.textContent = message;

                    SuccessPopUp.classList.remove('show'); // Ensure 'show' class is not there initially

                    setTimeout(() => {
                        // Now apply the 'show' class and trigger the transition
                        SuccessPopUp.classList.add('show');
                    }, 10); // Small delay to allow the browser to register the initial styles
                })
                .catch(error => console.error('Error loading PHP content:', error));
        }


        function fetchErrorMsg(message) {
            console.log('clickckc');

            popUpBg.classList.remove('hide');

            // Fetch the PHP content
            fetch('../popup/errorMessage.php') // Replace with the correct PHP file path
                .then(response => response.text())
                .then(data => {
                    popUpBg.innerHTML = data;

                    const ErrorPopUp = document.querySelector('.pop-up-error');
                    const errorLabel = ErrorPopUp.querySelector('label'); // Select the label inside the success popup

                    // Use the passed message parameter to set the label text
                    errorLabel.textContent = message;

                    ErrorPopUp.classList.remove('show'); // Ensure 'show' class is not there initially

                    setTimeout(() => {
                        // Now apply the 'show' class and trigger the transition
                        ErrorPopUp.classList.add('show');
                    }, 10); // Small delay to allow the browser to register the initial styles
                })
                .catch(error => console.error('Error loading PHP content:', error));
        }



        function closePopup() {



            popUpBg.classList.add('hide');


            // Remove the fetched content from the popup div
            popUpBg.innerHTML = '   ';


        }
    </script>

</body>

</html>