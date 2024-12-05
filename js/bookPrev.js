const bookPrev = document.getElementById('bookPrev');



function writeReviewClick(bookId) {
    // Show the review content with a transition
    const reviewContent = document.querySelector('.review-content');
    reviewContent.classList.add('show');

    // Replace the button's text and onclick handler
    const button = document.getElementById('writeReviewBtn');
    button.textContent = 'Submit';
    // Use an anonymous function to pass bookId to submitReviewClick
    button.onclick = function () {
        submitReviewClick(bookId);
    };
}







// Fetch the existing rating from the backend
function fetchExistingRating(bookId) {
    axios.get(`./db/php/bookPrev/getReview-api.php?book_id=${bookId}`)
        .then(response => {
            const rating = response.data.rating;
            const review_content = response.data.review_content;
            setExistingRating(rating, review_content); // Set the rating on the page
        })
        .catch(error => {
            console.error('Error fetching existing rating:', error);
        });
}

// Function to set the existing rating
function setExistingRating(rating, review_content) {

    console.log('review:' + review_content);
    const starsContainer = document.querySelector('.book-1 .stars-container');
    const starsContainer2 = document.querySelector('.write-review-control .stars-container');
    const starsContainer3 = document.querySelector('.rr-wrapper .stars-container');
 

  
    currentRating = rating;

    // Generate the stars dynamically using a template literal
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        // If the current star index is less than the rating, make it filled
        const starClass = i <= rating ? 'bxs-star' : 'bx-star';
        starsHTML += `<i class="bx ${starClass}" data-rating="${i}" onclick="setRating(${i})"></i>`;
    }

    // Insert the generated HTML into the stars container
    starsContainer.innerHTML = starsHTML;



    if (starsContainer2) {
        starsContainer2.innerHTML = starsHTML;
    }

    if (starsContainer3){
        starsContainer3.innerHTML = starsHTML;
    }


    // Optionally, you can also disable the hover functionality for already rated books
    if (rating > 0) {
        document.querySelectorAll('.rating-wrapper i').forEach(star => {
            star.removeEventListener('mouseover', previewRating);
        });

        document.querySelectorAll('.rating-wrapper').forEach(star => {
            star.removeAttribute('onmouseout');
        });

        document.querySelectorAll('.write-review-control .rating-wrapper').forEach(star => {
            star.removeAttribute('onmouseout');
        });




    } else {
        // Attach event listeners to handle hover effects globally
        document.querySelector('.rating-wrapper').addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'I') {
                const rating = parseInt(event.target.getAttribute('data-rating'), 10);
                previewRating(rating);
            }
        });


        document.querySelector('.make-Review-wrapper .rating-wrapper').addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'I') {
                const rating = parseInt(event.target.getAttribute('data-rating'), 10);
                previewRating(rating);
            }
        });
    }



}

// Handle the rating click (set the user's rating)
function setRating(rating) {
    currentRating = rating;
    setExistingRating(rating); // Update the star display based on the selected rating
}



if (bookPrev) {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');  // This will get the 'id' parameter
    fetchExistingRating(id);

}
else {
    console.log('nani');
}





var currentRating = 0; // Store the user's permanent rating

function previewRating(rating) {
    const stars = document.querySelectorAll('.rating-wrapper i');
    stars.forEach((star, index) => {
        // Highlight stars up to the hovered one
        if (index < rating) {
            star.classList.add('bxs-star');
            star.classList.remove('bx-star');
        } else {
            star.classList.add('bx-star');
            star.classList.remove('bxs-star');
        }
    });

    const stars2 = document.querySelectorAll('.write-review-control .rating-wrapper i');
    stars2.forEach((star, index) => {
        // Highlight stars up to the hovered one
        if (index < rating) {
            star.classList.add('bxs-star');
            star.classList.remove('bx-star');
        } else {
            star.classList.add('bx-star');
            star.classList.remove('bxs-star');
        }
    });
}

function resetRating() {
    const stars = document.querySelectorAll('.rating-wrapper i');
    const stars2 = document.querySelectorAll('.write-review-control .rating-wrapper i');
    stars.forEach((star, index) => {
        // Reset stars based on the currentRating
        if (index < currentRating) {
            star.classList.add('bxs-star');
            star.classList.remove('bx-star');
        } else {
            star.classList.add('bx-star');
            star.classList.remove('bxs-star');
        }
    });

    stars2.forEach((star, index) => {
        // Reset stars based on the currentRating
        if (index < currentRating) {
            star.classList.add('bxs-star');
            star.classList.remove('bx-star');
        } else {
            star.classList.add('bx-star');
            star.classList.remove('bxs-star');
        }
    });
}

// Set the user's rating
function setRating(rating) {
    currentRating = rating; // Save the current rating 
    resetRating(); // Update the stars to reflect the new rating
}





function submitReviewClick(bookId) {
    // Add logic for handling the review submission with the bookId
    rateBookClick(bookId);
}

function rateBookClick(bookId) {
    console.log("Rating: " + currentRating);

    // Get the plain text and HTML content from the editor
    const quillEditor = document.querySelector('#editor .ql-editor');
    const reviewContent = quillEditor.innerHTML.trim(); // Get HTML content
    const plainText = quillEditor.innerText.trim(); // Get plain text for validation

    // Check if the rating is greater than 0
    if (currentRating <= 0) {
        console.error("Rating must be greater than 0");
        alert("Please provide a rating before submitting your review.");
        return;
    }

    // Prepare the review data
    const reviewData = {
        book_id: bookId,
        rating: currentRating,
        review: plainText !== "" ? reviewContent : null, // Allow review to be null if empty
    };

    // Check if the user has already reviewed this book
    axios.post('./db/php/bookPrev/checkReview-api.php', { book_id: bookId })
        .then(response => {
            if (response.data.status === 'exists') {
                // If the review exists, send an update request
                updateReview(reviewData);
            } else {
                // If no review exists, create a new one
                createReview(reviewData);
            }
        })
        .catch(error => {
            console.error('Error checking review:', error);
            alert('An error occurred while checking your review status.');
        });
}

function updateReview(reviewData) {
    // Make the Axios request to update the review
    axios.post('./db/php/bookPrev/updateReview-api.php', reviewData)
        .then(response => {
            console.log('Review updated successfully:', response.data);
            if (response.data.status === 'success') {
                alert('Your review has been updated!');


                window.location.reload();
        
            }
        })
        .catch(error => {
            console.error('Error updating review:', error);
            alert('An error occurred while updating your review.');
        });
}

function createReview(reviewData) {
    // Make the Axios request to create a new review
    axios.post('./db/php/bookPrev/makeReview-api.php', reviewData)
        .then(response => {
            console.log('Review submitted successfully:', response.data);
            if (response.data.status === 'success') {
                alert('Your review has been submitted!');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            alert('An error occurred while submitting your review.');
        });
}



