// function setUserPlan(planId) {
//     if (planId === 1) {
//         // Free plan: No payment required
//         axios.post('./db/php/user/userPlan-api.php', { plan_id: planId })
//             .then(response => {
//                 if (response.data.status === 'success') {
//                     console.log('Plan upgraded:', response.data.message);
//                    // alert('You have successfully switched to the Free plan!');
//                     window.location.href = response.data.redirect;
//                 } else {
//                     console.error('Error:', response.data.message);
//                     alert(response.data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error('Request failed:', error.response?.data || error.message);
//                 alert('An error occurred. Please try again.');
//             });
//     } else {
//         // Paid plans: Trigger PayMaya for payment
//         const publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah'; // Sandbox Public API Key
//         const checkoutUrl = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts'; // PayMaya Sandbox API endpoint

//         // Set plan details based on selected plan
//         const planDetails = {
//             2: { name: 'Pro Plan', price: 399 },
//             3: { name: 'Elite Plan', price: 699 }
//         };

//         const payload = {
//             requestReferenceNumber: `${Date.now()}`,
//             totalAmount: {
//                 value: planDetails[planId].price,
//                 currency: 'PHP'
//             },
//             buyer: {
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 email: 'johndoe@example.com',
//                 contact: {
//                     phone: '+639171234567'
//                 },
//                 billingAddress: {
//                     line1: '123 Sample Street',
//                     city: 'Sample City',
//                     countryCode: 'PH'
//                 }
//             },
//             items: [ // Include product details (optional but recommended for some use cases)
//                 {
//                     name: planDetails[planId].name,
//                     quantity: 1,
//                     totalAmount: {
//                         value: planDetails[planId].price
//                     }
//                 }
//             ],
//             redirectUrl: {
//                 success: `http://localhost/library-group/db/php/user/userPlan-api.php?plan_id=${planId}`,
//                 failure: `http://localhost/library-group/db/php/user/userPlan-api.php?plan_id=${planId}`,
//                 cancel: `http://localhost/library-group/index.php?page=pricing`
//             }
//         };


//         // Send a POST request to create a PayMaya checkout session
//         fetch(checkoutUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                'Authorization': `Basic ${btoa(publicKey + ':')}` // Correct encoding with colon // Authorization using your public API key
//             },
//             body: JSON.stringify(payload)
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.redirectUrl) {
//                 window.location.href = data.redirectUrl;
//             } else {
//                 console.error('Error creating checkout session:', data);
//                 alert('An error occurred while creating the payment session.');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error.response?.data || error.message);
//             alert('An error occurred. Please try again.');
//         });

//     }
// }



// Function to handle payment link generation

// Main function to set user plan




// function setUserPlan(planId) {

//     // Free plan: No payment required
//     axios.post('./db/php/user/userPlan-alt-api.php', { plan_id: planId })
//         .then(response => {
//             if (response.data.status === 'success') {
//                 window.location.href = response.data.redirect;
//                 console.log('Plan upgraded:', response.data);
//                 // alert('You have successfully switched to the Free plan!');
//             } else {
//                 console.error('Error:', response.data.message);
//                 // alert(response.data.message);
//             }
//         })
//         .catch(error => {
//             console.error('Request failed:', error.response?.data || error.message);
//             alert('An error occurred. Please try again.');
//         });

// }




function setUserPlan(planId) {
    if (planId === 1) {
        // Free plan: No payment required
        axios.post('./db/php/user/userPlan-api.php', { plan_id: planId })
            .then(response => {
                if (response.data.status === 'success') {
                    console.log('Plan upgraded:', response.data.message);
                    window.location.href = response.data.redirect;
                } else {
                    console.error('Error:', response.data.message);
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Request failed:', error.response?.data || error.message);
                alert('An error occurred. Please try again.');
            });
    } else {
        // Paid plans: Use Stripe for payment
        const stripe = Stripe('pk_test_51QRZXgFxCsIfG670e1hQtwNzaJqeHhhTwoSZ0g5xwgjTApe46UJ94c46tSQGpy0htpszi4YdztBsKC6FSVjrk0yd00qrf19wSK'); // Replace with your test publishable key

        // Send a request to create a Stripe Checkout session on the server
        fetch('./js/create-checkout-session.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan_id: planId })
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
}
