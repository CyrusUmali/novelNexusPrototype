function fetchUserInfp() {
    // Function to fetch user info using Axios
    axios.get('./db/php/user/fetchUserInfo-api.php')
        .then(function (response) {
            if (response.data.status === 'success') {
                const user = response.data.user;

                // Insert the user info into the HTML
                document.getElementById('first-name').value = user.fname;
                document.getElementById('last-name').value = user.lname;
                document.getElementById('phone-number').value = user.phone;
                document.getElementById('email').value = user.email;
                document.getElementById('userPhoto').src = user.photo;


            } else {
                // Handle error if user data is not found
                alert(response.data.message || 'Failed to fetch user info.');
            }
        })
        .catch(function (error) {
            console.error('Error fetching user info:', error);
            alert('An error occurred while fetching the user information.');
        });
}

const userProfilePage = document.getElementById('userProfilePage');

if (userProfilePage) {
    fetchUserInfp();
    // viewFines();
}

const SubscriptionPage = document.getElementById('Subscription-page');

if (SubscriptionPage) {
    // viewFines();
}





















function updateUserInfo() {
    // Extract form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const email = document.getElementById('email').value;

    // Get the selected file (if any)
    const photoInput = document.getElementById('userPhotoInput');
    const photoFile = photoInput ? photoInput.files[0] : null;

    // Prepare form data for user information
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone_number', phoneNumber);
    formData.append('email', email);

    if (photoFile) {
        // Upload image to Cloudinary
        uploadImageToCloudinary(photoFile)
            .then(imageUrl => {
                // Add the image URL to the form data
                formData.append('user_photo', imageUrl);

                // Send data with FormData to ensure multipart/form-data encoding
                axios.post('./db/php/user/updateUserInfo-api.php', formData)
                    .then(response => {
                        if (response.data.status === 'success') {
                            console.log('User information updated:', response.data);
                            fetchSuccessMsg('User information updated successfully!');
                        } else {
                            console.error('Failed to update user information:', response.data.message);
                            fetchErrorMsg('Failed to update user information: ' + response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error updating user information:', error);
                        fetchErrorMsg('Failed to update user information due to an error.');
                    });
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                fetchErrorMsg('Failed to upload image.');
            });
    } else {
        // If no image was uploaded, send the data without the image
        axios.post('./db/php/user/updateUserInfo-api.php', formData)
            .then(response => {
                if (response.data.status === 'success') {
                    console.log('User information updated:', response.data);
                    fetchSuccessMsg('User information updated successfully!');
                } else {
                    console.error('Failed to update user information:', response.data.message);
                    fetchErrorMsg('Failed to update user information: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('Error updating user information:', error);
                fetchErrorMsg('Failed to update user information due to an error.');
            });
    }
}

function uploadImageToCloudinary(file) {
    const cloudName = 'dk41ykxsq'; // Replace with your Cloudinary cloud name
    const uploadPreset = 'my_upload_preset'; // Replace with your upload preset name

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    return fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                console.log('Image URL:', data.secure_url);
                return data.secure_url; // Return the image URL
            } else {
                throw new Error('Image upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            throw error;
        });
}


function updateUserPhoto() {
    // Get the button element
    const button = document.getElementById("updateUserButton");

    // Create a new input element
    const input = document.createElement("input");

    // Set the input attributes
    input.type = "file"; // Input type for file selection
    input.id = "userPhotoInput"; // Give the input an ID for reference
    input.name = "userPhoto"; // Optional, depends on your form setup
    input.accept = "image/*"; // Only accept image files (e.g., .jpg, .png, .gif)

    // Add onchange event to call a function when a file is selected
    input.onchange = function () {
        handleFileSelect(input);
    };

    // Replace the button with the input field
    button.replaceWith(input);
}

// Function to handle the file selection
function handleFileSelect(input) {
    const file = input.files[0]; // Get the first selected file
    if (file) {
        console.log("File selected:", file.name);

        const imagePreview = document.getElementById('userPhoto');
        imagePreview.src = URL.createObjectURL(event.target.files[0]);
        // You can add further code to upload the file or display a preview, etc.
    }
}









function changePasswordClick() {



    // Get form data
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }

    // Create the request payload
    const data = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
    };

    // Send data to the API
    axios.post('./db/php/user/changePassword-api.php', data)
        .then(response => {
            if (response.data.success) {
                alert('Password updated successfully');
            } else {
                alert('Error: ' + response.data.message);
            }

        })
        .catch(error => {
            console.error('Error changing password:', error);
            alert('An error occurred. Please try again later.');
        });

}





function viewFines() {


    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('./popup/viewFines.php')  // Replace with the correct PHP file path
        .then(response => response.text())
        .then(data => {
            popUpBg.innerHTML = data;

            const SuccessPopUp = document.getElementById('viewFines');

            // SuccessPopUp.classList.remove('show');  // Ensure 'show' class is not there initially

            // setTimeout(() => {

            //     SuccessPopUp.classList.add('show');
            // }, 10);   




            axios.get('./db/php/user/userViewFines-api.php')
                .then(response => {
                    if (response.data.error) {
                        // Handle error returned from the server
                        console.error(response.data.error);
                        alert("Error: " + response.data.error);
                    } else {
                        const overdueLoans = response.data.overdueLoans;
                        const tableBody = document.getElementById("finesTbody"); // Update with your table's ID or selector

                        if (overdueLoans.length === 0) {
                            alert("No overdue loans with fines for this user.");
                        } else {
                            // Clear existing table rows
                            tableBody.innerHTML = "";

                            // Populate the table with new data
                            overdueLoans.forEach(loan => {
                                const tr = document.createElement("tr");
                                tr.innerHTML = `
                       
                       
                        <td>


                        <div class="tdImg">
                            <img src="${loan.book_cover}" alt="Book Cover" />
                            <span class="span1">${loan.book_title}</span>
                        </div>
                        

                         </td>
                        <td>${loan.loan_from}</td>
                        <td>${loan.loan_to}</td> 
                        <td style="color: tomato;">${loan.fine ? `Fine: ₱${loan.fine}` : 'No Fine'}</td>
                    `;
                                tableBody.appendChild(tr);
                            });

                        }
                    }
                })
                .catch(error => {
                    // Handle errors such as network issues or server-side failures
                    console.error("Error fetching overdue loans:", error);
                    alert("An error occurred while fetching overdue loans.");
                });




        })
        .catch(error => console.error('Error loading PHP content:', error));



    // axios.get('./db/php/user/userViewFines-api.php')
    //     .then(response => {
    //         if (response.data.error) {
    //             // Handle error returned from the server
    //             console.error(response.data.error);
    //             alert("Error: " + response.data.error);
    //         } else {
    //             const overdueLoans = response.data.overdueLoans;

    //             if (overdueLoans.length === 0) {
    //                 console.log("No overdue loans with fines.");
    //                 alert("No overdue loans with fines for this user.");
    //             } else {
    //                 // Loop through and display the overdue loans
    //                 overdueLoans.forEach(loan => {
    //                     console.log(`Book Title: ${loan.book_title}`);
    //                     console.log(`Author: ${loan.author}`);
    //                     console.log(`Fine: ${loan.fine}`);
    //                     console.log(`Days Overdue: ${loan.days_overdue}`);
    //                 });
    //                 alert("Overdue loans fetched successfully. Check console for details.");
    //             }
    //         }
    //     })
    //     .catch(error => {
    //         // Handle errors such as network issues or server-side failures
    //         console.error("Error fetching overdue loans:", error);
    //         alert("An error occurred while fetching overdue loans.");
    //     });

}


// function payUserFines(amount) {
   
//     // Paid plans: Trigger PayMaya for payment
//     const publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah'; // Sandbox Public API Key
//     const checkoutUrl = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts'; // PayMaya Sandbox API endpoint

  

//     const payload = {
//         requestReferenceNumber: `${Date.now()}`,
//         totalAmount: {
//             value: amount,
//             currency: 'PHP'
//         },
//         buyer: {
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'johndoe@example.com',
//             contact: {
//                 phone: '+639171234567'
//             },
//             billingAddress: {
//                 line1: '123 Sample Street',
//                 city: 'Sample City',
//                 countryCode: 'PH'
//             }
//         },
//         items: [ // Include product details (optional but recommended for some use cases)
//             {
//                 name: "Book Fines",
         
//                 totalAmount: {
//                     value: amount
//                 }
//             }
//         ],
//         redirectUrl: {
//             success: `http://localhost/library-group/db/php/user/payFines-api.php?amount=${amount}`,
//             failure: `http://localhost/library-group/index.php?page=subscription`,
//             cancel: `http://localhost/library-group/index.php?page=subscription`
//         }
//     };
    

//     // Send a POST request to create a PayMaya checkout session
//     fetch(checkoutUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//            'Authorization': `Basic ${btoa(publicKey + ':')}` // Correct encoding with colon // Authorization using your public API key
//         },
//         body: JSON.stringify(payload)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.redirectUrl) {
//             window.location.href = data.redirectUrl;
//         } else {
//             console.error('Error creating checkout session:', data);
//             alert('An error occurred while creating the payment session.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         alert('An error occurred. Please try again.');
//     });

// }

function payUserFines(amount) {
    // Initialize Stripe with your publishable key
    const stripe = Stripe('pk_test_51QRZXgFxCsIfG670e1hQtwNzaJqeHhhTwoSZ0g5xwgjTApe46UJ94c46tSQGpy0htpszi4YdztBsKC6FSVjrk0yd00qrf19wSK'); // Replace with your test publishable key

    // Send a request to create a Stripe Checkout session on the server
    fetch('./js/create-fines-session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount })
    })
        .then(response => response.json())
        .then(session => {
            if (session.id) {
                // Redirect to Stripe Checkout page
                stripe.redirectToCheckout({ sessionId: session.id })
                    .then(result => {
                        if (result.error) {
                            console.error('Stripe error:', result.error.message);
                            alert('An error occurred. Please try again.');
                        }
                    });
            } else {
                console.error('Error creating checkout session:', session);
                alert('An error occurred while creating the payment session.');
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('An error occurred. Please try again.');
        });
}



function cancelPlan(){


    axios.post('./db/php/user/cancelPlan-api.php')
    .then(function (response) {
        if (response.data.status === 'success') {
            alert('Plan canceled successfully!');
            // You can redirect the user or update the UI here
            window.location.reload(); // or any other action to update the UI
        } else {
            alert('Failed to cancel the plan: ' + response.data.message);
        }
    })
    .catch(function (error) {
        console.error('Error occurred:', error);
        alert('An error occurred while canceling the plan. Please try again.');
    });



}