const popUpBg = document.querySelector('.main .pop-up-bg');
const popUpNotif = document.querySelector('.main .popup-notifications');



function myFunction() {
    console.log("Function triggered after redirect!");
    // Your actual function code here
}

// Check the URL for the query parameter
const params = new URLSearchParams(window.location.search);
if (params.has('trigger') && params.get('trigger') === 'true') {
    myFunction();
}

function viewBookClick(id) {
    window.location.href = `?page=book-prev&id=${id}`;
    console.log("book id", id);
}



const makeReview = document.getElementById('make-Review');


if (makeReview) {
    const quill = new Quill('#editor', {
        theme: 'snow'
    });

}




function fetchBooks(searchQuery = '') {
    const categoryId = document.getElementById("bookcategory").value;
    axios.get(`./db/php/userFetch_books-api.php?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(categoryId)}`)
        .then(response => {
            const books = response.data;
            const tableBody = document.getElementById("booksTableBody");
            tableBody.innerHTML = ''; // Clear previous entries

            books.forEach(book => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td> 
                        <div class="tdImg">
                            <img src="${book.book_cover}" alt="Book Cover" />
                            <span class="span1">${book.title}</span>
                        </div>
                    </td> 
                    <td>
                        <div class="wrapper">
                            <span class="span1">${book.author}</span>
                        </div>
                    </td>
                    <td>
                        ${book.average_rating ?
                        `<span class="rating">${book.average_rating.toFixed(1)}</span>` :
                        `<span class="rating">--</span>`}
                    </td>
                    <td>
                        <div class="book-info">
                            <span class="title">${book.category_names}</span>
                        </div>
                    </td>
                    <td>
                        <span class="${book.Availability === 'Available' ? 'green' : book.Availability === 'Loaned' ? 'red' : 'gray'}">
                            ${book.Availability}
                        </span>
                    </td>
                    <td>
                        ${book.in_shelf ? `
                            <i class="blue shelved" onclick="event.stopPropagation(); removeFromShelf(${book.id},this )">
                                <i class='bx bx-cabinet nav__icon'></i>  
                            </i>
                        ` : `
                            <i class="blue" onclick="event.stopPropagation(); addToShelf(this , ${book.id} )">
                                <i class='bx bx-cabinet nav__icon'></i> 
                            </i>
                        `}
                    </td>
                `;

                row.onclick = () => viewBookClick(book.id); // Set onclick event dynamically
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}


function removeFromShelf(bookId, button) {
    axios.post('./db/php/removeFromShelf-api.php', { book_id: bookId })
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Book removed successfully:', response.data.message); // Log success message



                notifToast2();

                // Update button to "Add to Shelf"
                button.classList.remove('shelved');
                button.innerHTML = `<i class='bx bx-cabinet nav__icon'></i> Add to Shelf`;
                button.onclick = () => addToShelf(button, bookId);
            } else {
                console.error('Error removing book from shelf:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}



function removeFromShelfPrev(bookId) {
    axios.post('./db/php/removeFromShelf-api.php', { book_id: bookId })
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Book removed successfully:', response.data.message); // Log success message


                window.location.reload();

            } else {
                console.error('Error removing book from shelf:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}



function setActive(element) {
    // Get all spans within the sections div
    const sections = document.querySelectorAll('.shelf-container .sections span');

    // Remove the 'active' class from all spans
    sections.forEach(span => span.classList.remove('active'));

    // Add the 'active' class to the clicked span
    element.classList.add('active');
}



// Load books initially when the page loads


const booksPage = document.getElementById('booksPage');

if (booksPage) {
    fetchBooks();
    console.log("fetchBooks();");
}


function setActiveCategory(element, categoryId) {
    // Remove 'active' class from all categories
    const categories = document.querySelectorAll('.home-categories-wrapper .item');
    categories.forEach(category => {
        category.classList.remove('active');
    });

    // Add 'active' class to the clicked category
    element.classList.add('active');

    // Call the function to fetch books based on the category
    fetchBooksWithCategories('', categoryId);
}


function fetchBooksWithCategories(searchQuery = '', categoryId = '') {
    // If categoryId is provided, use it; otherwise, use the selected value from the dropdown
    // categoryId = categoryId || document.getElementById("bookcategory").value;

    // Fetching books based on search query and category
    axios.get(`./db/php/fetch_books-api.php?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(categoryId)}`)
        .then(response => {
            const books = response.data;

            // Render books
            const booksWrapper = document.querySelector(".books-wrapper ul");
            booksWrapper.innerHTML = ''; // Clear previous entries

            books.forEach(book => {
                const bookItem = document.createElement("li");
                bookItem.setAttribute("data-page", "book-prev");
                bookItem.setAttribute("onclick", `viewBookClick(${book.id})`);

                bookItem.innerHTML = `
                    <img src="${book.book_cover}" alt="${book.title}">
                    <span class="title">${book.title}</span>
                    <span class="author">${book.author}</span>
                   <td>
        ${book.average_rating ?
                        `<span class="rating">${book.average_rating.toFixed(1)} / 5</span>` :
                        `<span class="rating">--</span>`}
    </td>
                `;

                booksWrapper.appendChild(bookItem);
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}




function removeToast() {

    console.log('just not wprlomng');
    const toast1 = document.getElementById('pnotif-card');
    const toast2 = document.getElementById('pnotif-card2');

    clearTimeout(toastTimeout); // Clear the previous timeout
    clearTimeout(hideTimeout);  // Clear any previous hide timeout

    // Briefly hide the toast (for 100ms or whatever you prefer)
    toast1.classList.remove('show');
    toast2.classList.remove('show');




}

let toastTimeout;
let hideTimeout;

function notifToast1() {
    const toast = document.getElementById('pnotif-card');

    // If the toast is already showing, briefly hide it and re-show after a short interval
    if (toast.classList.contains('show')) {
        clearTimeout(toastTimeout); // Clear the previous timeout
        clearTimeout(hideTimeout);  // Clear any previous hide timeout

        // Briefly hide the toast (for 100ms or whatever you prefer)
        toast.classList.remove('show');
        hideTimeout = setTimeout(function () {
            // Re-show the toast after a brief interval
            toast.classList.add('show');
        }, 500); // Brief hide time (in milliseconds)

    } else {
        // Add the 'show' class to make the toast visible
        toast.classList.add('show');
    }

    // Hide the toast after 3 seconds
    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 3000); // 3000ms = 3 seconds
}

function notifToast2() {
    const toast = document.getElementById('pnotif-card2');

    // If the toast is already showing, briefly hide it and re-show after a short interval
    if (toast.classList.contains('show')) {
        clearTimeout(toastTimeout); // Clear the previous timeout
        clearTimeout(hideTimeout);  // Clear any previous hide timeout

        // Briefly hide the toast (for 100ms or whatever you prefer)
        toast.classList.remove('show');
        hideTimeout = setTimeout(function () {
            // Re-show the toast after a brief interval
            toast.classList.add('show');
        }, 500); // Brief hide time (in milliseconds)

    } else {
        // Add the 'show' class to make the toast visible
        toast.classList.add('show');
    }

    // Hide the toast after 3 seconds
    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 3000); // 3000ms = 3 seconds
}




function addToShelf(button, bookId) {
    axios.post('./db/php/addToShelf-api.php', { book_id: bookId })
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Notification saved successfully:', response.data.message); // Log success message

                // Call your notification function
                notifToast1();

                // Add a class to the button to indicate it has been added
                button.classList.add('shelved');

                // Set the onclick attribute dynamically
                button.setAttribute('onclick', `removeFromShelf(this, ${bookId})`);

                // Update the button's inner HTML
                button.innerHTML = '<i class="bx bx-cabinet nav__icon"></i>';
                // Optionally change button text/icon
            } else {
                console.error('Error saving notification:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}


function addToShelfPrev(bookId) {
    axios.post('./db/php/addToShelf-api.php', { book_id: bookId })
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Notification saved successfully:', response.data.message); // Log success message

                window.location.reload();
            } else {
                console.error('Error saving notification:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}









const homePage = document.getElementById('home-page');

if (homePage) {
    fetchBooksWithCategories();
    console.log("fetchBooksWithCategories();");
}





const userBookShelf = document.getElementById('userBookShelf');

if (userBookShelf) {
    getBorrowedBooks();
    console.log('getAllUserBooks()');
}



// function getAllUserBooks() {
//     // Initialize promises to fetch borrowed books and shelf books
//     const borrowedBooksPromise = axios.get("./db/php/shelf/userborrowedBooks-api.php");
//     const shelfBooksPromise = axios.get("./db/php/shelf/userShelfBooks-api.php");

//     // Wait for both promises to resolve using Promise.all
//     Promise.all([borrowedBooksPromise, shelfBooksPromise])
//         .then(responses => {
//             const borrowedBooks = responses[0].data; // Data from borrowed books API
//             const shelfBooks = responses[1].data;    // Data from shelf books API

//             // Combine both arrays into one
//             const allBooks = [...borrowedBooks, ...shelfBooks];

//             // Shuffle the combined array using Fisher-Yates algorithm
//             for (let i = allBooks.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [allBooks[i], allBooks[j]] = [allBooks[j], allBooks[i]];
//             }

//             // Display the randomized books
//             const shelfWrapper = document.querySelector(".shelf-wrapper");
//             shelfWrapper.innerHTML = ""; // Clear any existing content

//             allBooks.forEach(book => {
//                 const itemDiv = document.createElement("div");
//                 itemDiv.className = "item";

//                 let buttonHtml = '';

//                 // Determine button based on loan status or shelf status
//                 if (book.status === "Returned" || book.loan_status === "Returned") {
//                     buttonHtml = `<button class="btn-1">Returned</button>`;
//                 } else if (book.status === "Pending" || book.loan_status === "Pending") {
//                     buttonHtml = `<button class="btn-1">Return Pending</button>`;
//                 } else if (book.status === "Rejected" || book.loan_status === "Rejected") {
//                     buttonHtml = `<button class="btn-1">Return Rejected</button>`;
//                 } else if (book.is_in_shelf && book.loan_status !== "Loaned") {
//                     buttonHtml = `<button class="btn-1" onclick="viewBookClick(${book.id})">View Book</button>`;
//                 } else {
//                     buttonHtml = `<button class="btn-1">Borrowed</button><button class="btn-2" onclick="returnBook(${book.book_id})">Return</button>`;
//                 }

//                 // Populate the book data
//                 itemDiv.innerHTML = `
//                     <div class="left">
//                         <img src="${book.book_cover}" alt="${book.title}">
//                         <span class="title">${book.title}</span>
//                         <span class="author">${book.author}</span>
//                     </div>
//                     <div class="right">
//                         <span>Loaned: ${book.loan_status || book.status}</span>
//                         ${buttonHtml}
//                     </div>
//                 `;

//                 shelfWrapper.appendChild(itemDiv);
//             });
//         })
//         .catch(error => {
//             console.error("Error fetching user books:", error);
//         });
// }



function getBorrowedBooks() {
    axios.get("./db/php/shelf/userborrowedBooks-api.php")
        .then(response => {
            console.log("Axios response:", response); // Log the entire response

            const data = response.data;

            // Check if data is an array
            if (Array.isArray(data)) {
                const shelfWrapper = document.querySelector(".shelf-wrapper");
                shelfWrapper.innerHTML = ""; // Clear any placeholder content

                // Check if the array is empty
                if (data.length === 0) {
                    shelfWrapper.innerHTML = `
                        <img src="./resources/librarry-bg5.png" alt="No borrowed books"
                        style="max-width: 20%;"
                        >
                    `;
                    return; // Exit the function since there's nothing to display
                }

                // If data is not empty, display the borrowed books
                data.forEach(book => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "item";

                    // Check loan status to determine which buttons to show
                    let buttonHtml = '';
                    console.log("bookstatus" + book.status);
                    if (book.status === "Returned") {
                        buttonHtml = `<button class="btn-1">Returned</button>`;
                    } else if (book.status === "Pending") {
                        buttonHtml = `<button class="btn-1">Return Pending</button>`;
                    } else if (book.status === "Rejected") {
                        buttonHtml = `<button class="btn-1">Return Rejected</button>`;
                    } else {
                        buttonHtml = `
                            <button class="btn-1">Borrowed</button>
                            <button class="btn-2" onclick="returnBook(${book.loan_id})">Return</button>
                        `;
                    }

                    itemDiv.innerHTML = `
                        <div class="left">
                            <img src="${book.book_cover}" alt="${book.title}">
                            <span class="title">${book.title}</span>
                            <span class="author">${book.author}</span>
                            <td>
                                ${book.average_rating ?
                            `<span class="rating">${book.average_rating.toFixed(1)} / 5</span>` :
                            `<span class="rating">--</span>`}
                            </td>
                        </div>
                        <div class="right">
                            <label>Borrowed On</label>
                            <span>${book.loan_from}</span>
                            <label>Submission Due</label>
                            <span>${book.loan_to}</span>
                            ${buttonHtml} <!-- Display appropriate buttons based on loan status -->
                        </div>
                    `;

                    shelfWrapper.appendChild(itemDiv);
                });
            } else {
                console.error("Error: Expected array but received:", data);
            }
        })
        .catch(error => console.error("Error fetching loans:", error));
}




function getShelfBooks() {
    axios.get("./db/php/shelf/userShelfBooks-api.php")
        .then(response => {
            console.log("Books from shelf:", response.data); // Log the data to check the response

            const data = response.data;
            const shelfWrapper = document.querySelector(".shelf-wrapper");
            shelfWrapper.innerHTML = '';


            // Check if the array is empty
            if (data.length === 0) {
                shelfWrapper.innerHTML = `
                    <img src="./resources/librarry-bg5.png" alt="No borrowed books"
                    style="max-width: 20%;"
                    >
                `;
                return; // Exit the function since there's nothing to display
            }

            // Check if data is an array
            if (Array.isArray(data)) {
                let booksWrapper = document.querySelector(".recommendation-wrapper");

                // If the .books-wrapper does not exist, create it dynamically
                if (!booksWrapper) {
                    booksWrapper = document.createElement("div");
                    booksWrapper.className = "recommendation-wrapper";

                    const ul = document.createElement("ul");
                    booksWrapper.appendChild(ul);

                    // Append booksWrapper to the main container or desired parent element
                    document.querySelector(".shelf-wrapper").appendChild(booksWrapper);
                }

                const ul = booksWrapper.querySelector("ul");
                ul.innerHTML = ""; // Clear any existing content

                // Dynamically populate the <ul> with <li> items
                data.forEach(book => {
                    const listItem = document.createElement("li");
                    listItem.setAttribute("data-page", "book-prev");
                    listItem.setAttribute("onclick", `viewBookClick(${book.id})`);

                    listItem.innerHTML = `
                        <img src="${book.book_cover}" alt="${book.title}">
                        <span class="title">${book.title}</span>
                        <span class="author">${book.author}</span>
                        ${book.average_rating ?
                            `<span class="rating">${book.average_rating.toFixed(1)} / 5</span>` :
                            `<span class="rating">--</span>`}
                    `;

                    ul.appendChild(listItem);
                });
            } else {
                console.error("Error: Expected array but received:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching shelf books:", error);
        });
}











function returnBook(id) {

    console.log('tesy:' + id)

    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`./popup/returnBook.php?loan_id=${id}`)  // Append the loan ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const returnBookPopUp = document.getElementById('returnBook');

            returnBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                returnBookPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));





}

function confirmReturnClick(id) {

    axios.post("./db/php/returnBook-api.php", { loan_id: id })
        .then(response => {
            const data = response.data;
            if (data.success) {
                fetchSuccessMsg("Book return is pending approval")

            } else {
                fetchErrorMsg("An error has Occured");
            }
        })
        .catch(error => console.error("Error returning book:", error));


}




function fetchSuccessMsg(message) {
    console.log('clickckc');

    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('./popup/successMessage.php')  // Replace with the correct PHP file path
        .then(response => response.text())
        .then(data => {
            popUpBg.innerHTML = data;

            const SuccessPopUp = document.querySelector('.pop-up-success');
            const successLabel = SuccessPopUp.querySelector('label'); // Select the label inside the success popup

            // Use the passed message parameter to set the label text
            successLabel.textContent = message;

            SuccessPopUp.classList.remove('show');  // Ensure 'show' class is not there initially

            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                SuccessPopUp.classList.add('show');
            }, 10);  // Small delay to allow the browser to register the initial styles
        })
        .catch(error => console.error('Error loading PHP content:', error));
}


function fetchErrorMsg(message) {
    console.log('clickckc');

    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('./popup/errorMessage.php')  // Replace with the correct PHP file path
        .then(response => response.text())
        .then(data => {
            popUpBg.innerHTML = data;

            const ErrorPopUp = document.querySelector('.pop-up-error');
            const errorLabel = ErrorPopUp.querySelector('label'); // Select the label inside the success popup

            // Use the passed message parameter to set the label text
            errorLabel.textContent = message;

            ErrorPopUp.classList.remove('show');  // Ensure 'show' class is not there initially

            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                ErrorPopUp.classList.add('show');
            }, 10);  // Small delay to allow the browser to register the initial styles
        })
        .catch(error => console.error('Error loading PHP content:', error));
}

function closePopup() {



    popUpBg.classList.add('hide');


    // Remove the fetched content from the popup div
    popUpBg.innerHTML = '   ';
    // Refresh the page
    window.location.reload();

}






function deleteReviewPopup(id) {


    console.log('tesy:' + id)

    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`./popup/deleteReview.php?review_id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const borrowBookPopUp = document.getElementById('deleteReview');

            borrowBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                borrowBookPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));



}

function confirmDeleteReview(id) {



    axios
        .delete('./db/php/bookPrev/deleteReview-api.php', {
            data: {
                review_id: id
            }
        })
        .then(response => {
            console.log('Review deleted:', response.data);
            fetchSuccessMsg("Successfully deleted Review");
        })
        .catch(error => {
            console.error('Error deleting review:', error);
            fetchErrorMsg("An error has occurred");
        });



}


// borrow

function borrowBookClick(id) {
    console.log('tesy:' + id)

    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`./popup/borrowBook.php?book_id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const borrowBookPopUp = document.getElementById('borrowBook');

            borrowBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                borrowBookPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles



            const today = new Date().toISOString().split("T")[0];
            const fromDate = document.getElementById('loan_from');

            fromDate.value = today;



        })
        .catch(error => console.error('Error loading PHP content:', error));



}


function confirmBorrowBook(id) {
    const fromDate = document.getElementById('loan_from').value;
    const toDate = document.getElementById('loan_to').value;

    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);

    // Check if all values are provided
    if (!id || !fromDate || !toDate) {
        alert("Please fill in all fields.");
        return;
    }


    // Check if 'to_date' is later than 'from_date'
    if (new Date(toDate) <= new Date(fromDate)) {
        alert("'Loan to' date must be later than the 'Loan from' date.");
        return;
    }


    // Send the data to the server via Axios
    axios.post('./db/php/userBorrow-api.php', {
        book_id: id,
        from_date: fromDate,
        to_date: toDate
    })
        .then(response => {
            const responseData = response.data;

            if (responseData.success) {
                console.log('Book loan data saved:', responseData);
                fetchSuccessMsg(responseData.message || "Successfully Borrowed Book");
            } else if (responseData.error) {
                console.warn('Server returned an error:', responseData.error);
                fetchErrorMsg(responseData.error);
            } else {
                console.warn('Unexpected response:', responseData);
                fetchErrorMsg("An unexpected error occurred. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error saving book loan data:', error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : "An error has occurred. Please try again.";
            fetchErrorMsg(errorMessage);
        });
}









function showNotif() {
    fetchNotifDetails();
    // Toggle the 'hide' class to toggle visibility of the notification popup
    popUpNotif.classList.toggle('hide');

    const notifCount = document.querySelector('.notifCount');

    notifCount.style.display = 'none';

}

function fetchNotifCount() {
    axios.get('./db/php/countUnreadNotif-api.php')
        .then(response => {
            const data = response.data;

            const notifCount = document.querySelector('.notifCount');



            if (data.status === 'success') {
                const unreadCount = data.unread_count;
                notifCount.textContent = unreadCount;
                notifCount.style.display = unreadCount > 0 ? 'inline' : 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching unread count:', error);
        });
}

function fetchNotifDetails() {
    axios.get('./db/php/fetchNotif.php')
        .then(response => {
            const data = response.data;
            const notifContent = document.getElementById('notifContent');
            notifContent.innerHTML = '';

            if (data.status === 'success') {
                const notificationsHtml = data.notifications.map(notification => {
                    if (notification.message !== null) {
                        return `
                            <div class="row">
                                <img src="${notification.book_cover}" alt="Book Image">
                                <div class="notif-msg-cont">
                                    <b>Admin</b>
                                    <span class="msg">${notification.message}</span> <br/>
                                    <span class="date">${new Date(notification.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        `;
                    } else {
                        const daysLeft = notification.days_left;
                        let message = `Your book '${notification.book_title}' is due in ${daysLeft} days.`;

                        // Modify the message if the due date is passed
                        if (daysLeft <= 0) {
                            message = `Your book '${notification.book_title}' is overdue.`;
                        }

                        return `
                            <div class="row">
                                <img src="${notification.book_cover}" alt="Book Image">
                                <div class="notif-msg-cont">
                                    <b>Admin</b>
                                    <span class="msg">${message}</span>
                                    <br/>  
                                    <span class="date">${new Date(notification.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        `;
                    }
                }).join('');

                notifContent.innerHTML = notificationsHtml || '<p style="text-align: center;margin-top:20px;">No notifications available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
}








fetchNotifCount();




