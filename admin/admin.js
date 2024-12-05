const popUpBg = document.querySelector('.admin-main .pop-up-bg');
const addNewBook = document.querySelector('.admin-main .pop-up-bg .addNewBook-container');

const deleteBook = document.querySelector('.admin-main .pop-up-bg .deleteBook-container');
const editBook = document.querySelector('.admin-main .pop-up-bg .editBook-container');
const logoutCont = document.querySelector('.admin-main .pop-up-bg .logout-container');


var categoryDropdown;
var selectedCategoriesContainer;


let paymentPerPage = 3;
let paymentSearchQuery = '';
let paymentCurrentPage = 1;



function displayImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.style.display = 'block';
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
        });
}



function logoutClick() {
    popUpBg.classList.remove('hide');
    logoutCont.classList.remove('hide');
}

function logoutXClick() {
    popUpBg.classList.add('hide');
    logoutCont.classList.add('hide');
}

function confirmlogoutClick() {
    popUpBg.classList.add('hide');
    logoutCont.classList.add('hide');
}

updateLoanStatus();

function updateLoanStatus() {
    fetch('../db/php/updateLoanStatus-api.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Loan statuses updated successfully.');
            } else {
                console.error('Failed to update loan statuses:', data.message);
            }
        })
        .catch(error => console.error('Error calling the API:', error));


}




//   BOOK >>>>>>>>>>>>>>>>>>>>>>>>



function fetchBooks(searchQuery = '') {
    const categoryId = document.getElementById("bookcategory").value;
    axios.get(`../db/php/fetch_books-api.php?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(categoryId)}`)
        .then(response => {
            const books = response.data;
            const tableBody = document.getElementById("booksTableBody");
            tableBody.innerHTML = ''; // Clear previous entries

            books.forEach(book => {
                const row = document.createElement("tr");

                row.innerHTML = ` 
                        
                   
                          <td  > 
                               <div class="tdImg">
                                   <img src="${book.book_cover}" alt="Book Cover" />
                                 <span class="span1" >  ${book.title}</span
                                 </div
                         </td> 

                     <td onclick="viewBookClick(${book.id}>
                        <div class="wrapper">

                         
                                <span class="span1" >${book.author}</span>
                          
                        </div>
                    </td>


                  <td>
        ${book.average_rating ?
                        `<span class="rating">${book.average_rating.toFixed(1)} </span>` :
                        `<span class="no-rating">--</span>`}
    </td>
                  
                    <td>
      <div class="book-info">
    <span class="title" >    ${book.category_names}</span>
    </div>
 
    </td>
                    <td>
                        <span class="${book.Availability === 'Available' ? 'green' : book.Availability === 'Loaned' ? 'red' : 'gray'}">
                            ${book.Availability}
                        </span>
                    </td> 
                    <td>
                        <div class="action-wrapper">
                            <i class='bx bx-edit-alt nav__icon' onclick="editBookClick(${book.id})"></i>
                            <i class='bx bx-trash nav__icon' onclick="deleteBookClick(${book.id})"></i>
                           
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}


// Load books initially when the page loads


const booksPage = document.getElementById('booksPage');

if (booksPage) {
    fetchBooks();
    console.log("fetchBooks();");
}



function closePopup() {



    popUpBg.classList.add('hide');


    // Remove the fetched content from the popup div
    popUpBg.innerHTML = '   ';
    // Refresh the page
    window.location.reload();

}





function testClick() {
    console.log('testClick:');
}

function addBookClick() {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('../popup/addBook.php')  // Replace with the correct PHP file path
        .then(response => response.text())
        .then(data => {
            popUpBg.innerHTML = data;

            const addNewBookPopUp = document.getElementById('addNewBook');

            addNewBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            selectedCategoriesContainer = document.querySelector('.admin-main .pop-up-bg .selected-categories-container');
            categoryDropdown = document.getElementById('bookcategory');


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                addNewBookPopUp.classList.add('show');
                const quill = new Quill('#editor', {
                    theme: 'snow'
                });
            }, 10);  // Small delay to allow the browser to register the initial styles
        })
        .catch(error => console.error('Error loading PHP content:', error));
}




function addNewBookClick() {
    // Get values from input fields
    const addButton = document.getElementById('addBookButton');
    addButton.disabled = true;

    const bookTitle = document.getElementById('booktitle').value.trim();
    const bookAuthor = document.getElementById('bookauthor').value.trim();
    const bookISBN = document.getElementById('bookisbn').value.trim();
    const aboutBook = document.querySelector('#editor .ql-editor').innerHTML.trim();
    const bookCoverInput = document.getElementById('bookcover');
    const bookCover = bookCoverInput.files[0];

    // Get selected categories from the selectedCategoriesContainer
    const selectedCategories = Array.from(selectedCategoriesContainer.children).map(el => el.dataset.id);

    // Check for empty fields
    if (!bookTitle || !bookAuthor || !bookISBN || !aboutBook || !bookCover || selectedCategories.length === 0) {
        alert("Please fill in all fields, select a book cover, and choose at least one category.");
        addButton.disabled = false; // Re-enable the button 
    } else {
        // Log values to the console
        console.log('Book Title:', bookTitle);
        console.log('Author:', bookAuthor);
        console.log('ISBN:', bookISBN);
        console.log('About the Book:', aboutBook);
        console.log('Selected Categories:', selectedCategories);

        // Upload the image and get the URL
        uploadImageToCloudinary(bookCover).then(imageUrl => {
            // Use Axios to send the book data to the server-side script
            axios.post('../db/php/addBook-api.php', {
                title: bookTitle,
                author: bookAuthor,
                isbn: bookISBN,
                category_ids: selectedCategories,  // Send selected categories
                book_cover: imageUrl, // Use the uploaded image URL
                about: aboutBook
            })
                .then(response => {
                    console.log('Book saved:', response.data);
                    popUpBg.innerHTML = '';
                    fetchSuccessMsg("Book saved successfully");
                    addButton.disabled = false; // Re-enable the button
                })
                .catch(error => {
                    console.error('Error saving book data:', error);
                    fetchErrorMsg("Failed to save Book");
                    addButton.disabled = false; // Re-enable the button
                });
        });
    }
}



function handleSelectedCategs() {

    const selectedValue = categoryDropdown.value;
    const selectedText = categoryDropdown.options[categoryDropdown.selectedIndex].text;

    // Check if the category is already selected
    if (Array.from(selectedCategoriesContainer.children).some(el => el.dataset.id === selectedValue)) {
        alert('This category is already selected.');
        return;
    }

    // Create a new category item using template literals
    const categoryItem = document.createElement('div');
    categoryItem.className = 'selected-category-item';
    categoryItem.dataset.id = selectedValue;
    categoryItem.innerHTML = `
            <span>${selectedText}</span>
            <i class="bx bx-x nav__icon" style="cursor: pointer; "></i>
        `;

    // Add remove functionality
    const removeIcon = categoryItem.querySelector('.bx.bx-x');
    removeIcon.addEventListener('click', () => {
        selectedCategoriesContainer.removeChild(categoryItem);
    });

    // Append the category item to the container
    selectedCategoriesContainer.appendChild(categoryItem);

    // Reset the dropdown to its placeholder
    categoryDropdown.value = '';

}




// ADD BOOK <<<<<<<<<<<<<<<<<<<<<<<<






function fetchSuccessMsg(message) {


    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('../popup/successMessage.php')  // Replace with the correct PHP file path
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
    fetch('../popup/errorMessage.php')  // Replace with the correct PHP file path
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


function deleteBookXClick() {
    popUpBg.classList.add('hide');
    deleteBook.classList.add('hide');
}

function editBookXClick() {
    popUpBg.classList.add('hide');
    editBook.classList.add('hide');
}











function editBookClick(id) {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`../popup/editBook.php?id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const addNewBookPopUp = document.getElementById('addNewBook');

            addNewBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially

            selectedCategoriesContainer = document.querySelector('.admin-main .pop-up-bg .selected-categories-container');
            categoryDropdown = document.getElementById('bookcategory');

            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                addNewBookPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles

            const quill = new Quill('#editBookeditor', {
                theme: 'snow'
            });
            // Set the editor content using the hidden field’s value
            const aboutBook = document.getElementById('aboutBook').value;
            quill.root.innerHTML = aboutBook; // Load the description into the editor

        })
        .catch(error => console.error('Error loading PHP content:', error));
}
function updateBookClick(bookId) {
    // Get values from input fields 
    const bookTitle = document.getElementById('booktitle').value.trim();
    const bookAuthor = document.getElementById('bookauthor').value.trim();
    const bookISBN = document.getElementById('bookisbn').value.trim();
    const editBookeditor = document.querySelector('#editBookeditor .ql-editor').innerHTML.trim();
    const bookCoverInput = document.getElementById('bookcover'); // Get the file input element
    const bookCover = bookCoverInput.files[0]; // Get the selected file

    // Get selected categories from the selectedCategoriesContainer
    const selectedCategories = Array.from(selectedCategoriesContainer.children).map(el => el.dataset.id);

    // Check if required fields are filled
    if (!bookTitle || !bookAuthor || !bookISBN || !editBookeditor || selectedCategories.length === 0) {
        alert("Please fill in all fields and select at least one category.");
        return; // Stop the update process if validation fails
    }

    // Log values to the console
    console.log('Book Title:', bookTitle);
    console.log('Author:', bookAuthor);
    console.log('ISBN:', bookISBN);
    console.log('About the Book:', editBookeditor);
    console.log('Selected Categories:', selectedCategories);

    // Prepare the data object for the update request
    const bookData = {
        id: bookId, // Include the book ID to identify which book to update
        title: bookTitle,
        author: bookAuthor,
        isbn: bookISBN,
        category_ids: selectedCategories, // Send the selected categories
        about: editBookeditor
    };

    // Upload the image if a new one is selected
    if (bookCover) {
        uploadImageToCloudinary(bookCover).then(imageUrl => {
            bookData.book_cover = imageUrl; // Use the uploaded image URL
            // Use Axios to send the book data to the server-side script
            axios.post('../db/php/updateBook-api.php', bookData)
                .then(response => {
                    console.log('Book updated:', response.data);
                    fetchSuccessMsg("Book Updated Successfully");
                })
                .catch(error => {
                    console.error('Error updating book data:', error);
                    fetchErrorMsg("Error Updating Book");
                });
        });
    } else {
        // If no new cover is uploaded, send the book data without the cover URL
        axios.post('../db/php/updateBook-api.php', bookData)
            .then(response => {
                console.log('Book updated:', response.data);
                fetchSuccessMsg("Book Updated Successfully");
            })
            .catch(error => {
                console.error('Error updating book data:', error);
                fetchErrorMsg("Error Updating Book");
            });
    }
}





// Global variable to store the book ID
let bookIdToDelete;

function deleteBookClick(id) {
    // Store the book ID in the global variable
    bookIdToDelete = id;

    // Show the popup background
    popUpBg.classList.remove('hide');

    // Fetch the delete confirmation content (optional, for displaying the confirmation prompt)
    fetch(`../popup/deleteBook.php?id=${id}`)
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const deleteBookPopUp = document.getElementById('deleteBook');

            deleteBookPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                deleteBookPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));
}

function confirmDeleteClick() {
    if (!bookIdToDelete) {
        console.error("No book ID specified for deletion.");
        return;
    }

    // Use Axios to send a POST request to delete the book
    axios.post('../db/php/deleteBook-api.php', { id: bookIdToDelete })
        .then(response => {
            if (response.data.success) {
                fetchSuccessMsg("Book deleted successfully");
            } else {
                fetchErrorMsg("Failed to delete the book");
            }

        })
        .catch(error => {
            console.error('Error deleting book:', error);
        });
}


function viewBookClick(id) {
    window.location.href = `?page=book-prev&id=${id}`;
}



















// User <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

let userSearchQuery = '';
let usersCurrentPage = 1;

function userSearch(event) {
    userSearchQuery = event.target.value.trim();
    usersCurrentPage = 1; // Reset to the first page for new search results
    fetchUsers(usersCurrentPage, userSearchQuery);
}



let usersPerPage = 5;


// Function to fetch users for the given page
function fetchUsers(page, userSearchQuery = '') {
    const offset = (page - 1) * usersPerPage;

    // Make the AJAX request to fetch user data
    axios.get('../db/php/fetchUsers-api.php', {
        params: {
            page: page,
            limit: usersPerPage,
            search: userSearchQuery // Pass the search query to the API
        }
    })
        .then(response => {
            // Update the table content with the fetched users
            updateTable(response.data.users);

            // Update the pagination links
            updatePagination(response.data.totalUsers, page);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


// Function to update the table with user data
function updateTable(users) {
    const tbody = document.querySelector('.overdueTbl tbody');
    tbody.innerHTML = '';

    const usersTblPaginationContainer = document.getElementById('usersTablePaginationContainer');

    if (users.length === 0) {
        // Display a "No Results" row if no users are found
        usersTblPaginationContainer.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td colspan="4" style="text-align: center;">No results found</td>
            `;
        tbody.appendChild(tr);
        return;
    }

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.classList.add('user-row');
        tr.dataset.id = user.id;
        tr.dataset.fname = user.fname;
        tr.dataset.lname = user.lname;
        tr.dataset.phone = user.phone;
        tr.dataset.email = user.email;
        tr.dataset.status = user.status;
        tr.dataset.plan_id = user.plan_id;
        tr.dataset.plan_start = user.subscription_start;
        tr.dataset.plan_end = user.subscription_end;
        tr.dataset.photo = user.photo;


        tr.innerHTML = `
                <td>${user.id}</td>
                <td class="tdImg">
                    <img src="${user.photo}" alt="User Image">
                    ${user.fname} ${user.lname}
                </td>
                <td>${user.books_issued}</td>
                <td>${user.name}</td>
            `;

        // Attach an onclick event to the row
        tr.onclick = function () {
            // Highlight the active row
            document.querySelectorAll('.user-row').forEach(row => row.classList.remove('active-row'));
            tr.classList.add('active-row');

            // Update the user profile section with this row's data
            updateUserProfile(tr);
        };

        tbody.appendChild(tr);

        // Highlight the first row by default
        if (index === 0) {
            tr.classList.add('active-row');
            updateUserProfile(tr);
        }
    });

}

// Function to update the pagination links
function updatePagination(totalUsers, usersCurrentPage) {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pagination = document.getElementById('pagination');

    // Clear the current pagination links
    pagination.querySelectorAll('a.page-number').forEach(link => {
        link.remove();
    });

    // Add page numbers dynamically
    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement('a');
        li.classList.add('page-number');
        li.href = '#';
        li.innerHTML = `<li>${page}</li>`;

        if (page === usersCurrentPage) {
            li.classList.add('is-active');
        }

        li.onclick = function (e) {
            e.preventDefault();
            fetchUsers(page, userSearchQuery);
        };

        pagination.insertBefore(li, document.getElementById('next'));
    }

}

const usersPage = document.getElementById('usersPage');

if (usersPage) {
    // Initially load users for the first page
    fetchUsers(usersCurrentPage);
    console.log('fetchUsers');
}












// Set the default active row on page load
document.addEventListener('DOMContentLoaded', function () {
    const defaultRow = document.querySelector('.user-row.active-row');
    if (defaultRow) {
        updateUserProfile(defaultRow); // Load the default user's data
    }
});


// Function to update user profile details
function updateUserProfile(row) {
    const userId = row.dataset.id;
    const fname = row.dataset.fname;
    const lname = row.dataset.lname;
    const phone = row.dataset.phone;
    const email = row.dataset.email;
    const status = row.dataset.status;
    const plan_id = row.dataset.plan_id;
    const plan_start = row.dataset.plan_start;
    const plan_end = row.dataset.plan_end;
    const photo = row.dataset.photo;

    // Update profile section
    document.getElementById('profileImage').src = photo;
    document.getElementById('fname').value = fname;
    document.getElementById('lname').value = lname;
    document.getElementById('phone').value = phone;
    document.getElementById('email').value = email;
    document.getElementById('status').value = status;
    document.getElementById('plan').value = plan_id;
    document.getElementById('userName').textContent = fname + " " + lname;
    document.getElementById('plan_end').value = plan_end;
    document.getElementById('plan_start').value = plan_start;

    const updateButton = document.getElementById('updateButton');

    updateButton.onclick = function () {
        updateUserInfo(userId);
    }



    // Fetch borrow history for this user
    fetchLoanHistory(userId);
}


function updateUserInfo(id) {


    const status = document.getElementById('status').value;
    const plan_id = document.getElementById('plan').value;
    const plan_end = document.getElementById('plan_end').value;
    const plan_start = document.getElementById('plan_start').value;



    // Log the incoming ID and other parameters
    console.log('test:', id);
    console.log('status:', status);
    console.log('plan_id:', plan_id);
    console.log('plan_end:', plan_end);
    console.log('plan_start:', plan_start);

    axios.post('../db/php/user/updateUser-1-api.php', {
        id: id,
        status: status,
        plan_id: plan_id,
        plan_start: plan_start,
        plan_end: plan_end
    })
        .then(response => {
            if (response.data.success) {
                console.log('User updated successfully:', response.data.message);
                fetchSuccessMsg("User Info Updated");
            } else {
                console.error('Failed to update user:', response.data.message);
                fetchErrorMsg("Failed to update user");
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
        });


}


function fetchLoanHistory(userId) {





    fetch(`../db/php/fetchUserLoanHistory-api.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            // Display borrow history
            const historyTable = document.getElementById('userLoanHistory');
            historyTable.innerHTML = ''; // Clear existing rows

            if (data.length > 0) {
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>${item.id}</td>
                        
                              <td class="tdImg">
                                 <img src="${item.book_cover}" alt="User Image">
                                ${item.book_title}
                                 </td>
                            <td>${item.loan_from}</td>
                            <td>${item.loan_to}</td>
                            <td>${item.status}</td>
                        `;
                    historyTable.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" style="text-align: center;">No books loaned</td>`;
                historyTable.appendChild(row);
            }
        })
        .catch(error => console.error('Error fetching loan history:', error));
}






// User >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



















function loanSearch(event) {
    loanSearchQuery = event.target.value.trim();
    loansCurrentPage = 1; // Reset to the first page for new search results
    fetchLoans(loansCurrentPage, loanSearchQuery);
}


//   LOAN >>>>>>>>>>>>>>>>>>>>..


const loansPerPage = 8;
let loansCurrentPage = 1;
let loanSearchQuery = '';





// Function to fetch loans for the given page
function fetchLoans(page) {
    const offset = (page - 1) * loansPerPage;

    // Make the AJAX request to fetch loan data
    axios.get('../db/php/fetchLoans-api.php', {
        params: {
            page: page,
            limit: loansPerPage,
            search: loanSearchQuery
        }
    })
        .then(response => {
            // Update the table content with the fetched loans
            updateLoansTable(response.data.loans);

            // Update the pagination links
            updateLoansPagination(response.data.totalLoans, page);
        })
        .catch(error => {
            console.error('Error fetching loans data:', error);
        });
}

// Function to update the table with loan data
function updateLoansTable(loans) {
    const tbody = document.querySelector('.overdueTbl tbody');
    tbody.innerHTML = '';
    console.log(loans);

    const pagination = document.getElementById('loansPagination');

    if (loans.length === 0) {
        // Display a "No Results" row if no users are found
        pagination.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td colspan="7" style="text-align: center;">No results found</td>
            `;
        tbody.appendChild(tr);
        return;
    }

    loans.forEach((loan) => {
        const tr = document.createElement('tr');
        tr.classList.add('loan-row');
        tr.dataset.id = loan.user_id;
        tr.dataset.member = loan.member;
        tr.dataset.bookId = loan.book_id;
        tr.dataset.bookTitle = loan.book_title;
        tr.dataset.loanFrom = loan.loan_from;
        tr.dataset.loanTo = loan.loan_to;
        tr.dataset.status = loan.status;
        tr.dataset.fine = loan.fine;
        tr.dataset.loanId = loan.loan_id;
        tr.dataset.photo = loan.photo;
        tr.dataset.bookCover = loan.book_cover;

        // Apply conditional styling for the fine column
        const fineStyle = loan.paid === 0 && loan.fine > 0 ? 'color: tomato;' : 'color: mediumseagreen;';

        let bellIcon = '';
        if (loan.status !== 'Returned') {
            bellIcon = `<i class='bx bx-bell nav__icon' onclick="notifyDaysLeft(${loan.loan_id},${loan.user_id})"></i>`;
        }

        tr.innerHTML = `
                <td>${loan.loan_id}</td>
                <td> 
                    <div class="tdImg">
                        <img src=${loan.photo} alt="Member Photo" />
                        <span>  ${loan.member}  </span>
                    </div>
                </td> 
                <td> 
                    <div class="tdImg">
                        <img src=${loan.book_cover} alt="Book Cover" />
                        <span>   ${loan.book_title}</span>
                    </div>
                </td> 
                <td>${loan.loan_from}</td>
                <td>${loan.loan_to}</td>
                <td>${loan.status}</td>
                <td style="${fineStyle}">${loan.fine}</td>
                <td>
                    <i class='bx bx-edit-alt nav__icon' onclick="editLoanClick(${loan.loan_id})"></i>
                    <i class='bx bx-trash nav__icon' onclick="deleteLoanClick(${loan.loan_id})"></i>
                    ${bellIcon}
                </td>
            `;

        tbody.appendChild(tr);
    });
}


// Function to update the pagination links
function updateLoansPagination(totalLoans, loansCurrentPage) {
    const totalPages = Math.ceil(totalLoans / loansPerPage);
    const pagination = document.getElementById('loansPagination');

    // Clear the current pagination links
    pagination.querySelectorAll('a.page-number').forEach(link => {
        link.remove();
    });

    // Add page numbers dynamically
    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement('a');
        li.classList.add('page-number');
        li.href = '#';
        li.innerHTML = `<li>${page}</li>`;

        if (page === loansCurrentPage) {
            li.classList.add('is-active');
        }
        li.onclick = (e) => {
            e.preventDefault();
            fetchLoans(page);
        };

        pagination.insertBefore(li, document.getElementById('next'));
    }





    // Disable or enable the Prev/Next buttons

}

// Initially load loans for the first page


const loansPage = document.getElementById('loansPage');

if (loansPage) {
    // Initially load users for the first page
    fetchLoans(loansCurrentPage);
    console.log('loansPage');
}









let toastTimeout;
let hideTimeout;

function notifToast() {
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



function removeToast() {

    const toast1 = document.getElementById('pnotif-card');

    clearTimeout(toastTimeout); // Clear the previous timeout
    clearTimeout(hideTimeout);  // Clear any previous hide timeout

    // Briefly hide the toast (for 100ms or whatever you prefer)
    toast1.classList.remove('show');





}




function notifyDaysLeft(loanId) {
    axios.post('../db/php/saveNotification-api.php', { loan_id: loanId })
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Notification saved successfully:', response.data.message); // Log success message


                notifToast();

            } else {
                console.error('Error saving notification:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}









function showAddNewLoan() {


    popUpBg.classList.remove('hide');

    // Fetch the PHP content
    fetch('../popup/addLoan.php')  // Replace with the correct PHP file path
        .then(response => response.text())
        .then(data => {
            popUpBg.innerHTML = data;

            const addLoanPopUp = document.getElementById('loansPage');

            addLoanPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                addLoanPopUp.classList.add('show');

                $(document).ready(function () {
                    // Initialize Select2
                    $('#user_id').select2({
                        placeholder: "Select a user",
                        allowClear: true
                    }).on('select2:open', function () {
                        console.log('Select2 dropdown opened');
                    }).on('select2:select', function (e) {
                        console.log('Item selected:', e.params.data);
                    }).on('select2:unselect', function (e) {
                        console.log('Item unselected:', e.params.data);
                    });

                    // Handle the change event
                    $('#user_id').on('change', function () {
                        // Check if there is a selected option
                        var selectedOption = $(this).find('option:selected');

                        var fullname = selectedOption.data('fullname'); // Extract the 'fullname' data attribute

                        console.log("Selected Fullname: ", fullname);


                    });
                });





                $(document).ready(function () {
                    // Initialize Select2
                    $('#book_id').select2({
                        placeholder: "Select a Book",
                        allowClear: true
                    }).on('select2:open', function () {
                        console.log('Select2 dropdown opened');
                    }).on('select2:select', function (e) {
                        console.log('Item selected:', e.params.data);
                    }).on('select2:unselect', function (e) {
                        console.log('Item unselected:', e.params.data);
                    });

                    // Handle the change event
                    $('#book_id').on('change', function () {
                        // Check if there is a selected option
                        var selectedOption = $(this).find('option:selected');

                        var fullname = selectedOption.data('fullname'); // Extract the 'fullname' data attribute

                        // Log the role and fullname to verify they're being captured

                        console.log("Selected Fullname: ", fullname);


                    });
                });


            }, 10);  // Small delay to allow the browser to register the initial styles
        })
        .catch(error => console.error('Error loading PHP content:', error));


}


function AddBookLoanClick() {
    // Get the selected user and book values
    const userInput = document.getElementById('user_id').value;
    const bookInput = document.getElementById('book_id').value;
    const fromDate = document.getElementById('loan_from').value;
    const toDate = document.getElementById('loan_to').value;

    // Check if the user selected a valid user
    const selectedUser = document.querySelector(`#user_id option[value="${userInput}"]`);
    const selectedBook = document.querySelector(`#book_id option[value="${bookInput}"]`);

    // Get the user ID and fullname from the selected option
    const userId = selectedUser ? selectedUser.value : null;

    // Get the book ID from the selected option
    const bookId = selectedBook ? selectedBook.value : null;



    // Log the values to console for verification
    console.log("bookinput", bookInput);
    console.log('User ID:', userId);
    console.log('Book ID:', bookId);
    console.log('From Date:', fromDate);
    console.log('To Date:', toDate);

    // Check if all values are provided
    if (!userId || !bookId || !fromDate || !toDate) {
        alert("Please fill in all fields.");
        return;
    }



    // Send the data to the server via Axios
    axios.post('../db/php/addBookLoan-api.php', {
        user_id: userId,
        book_id: bookId,
        from_date: fromDate,
        to_date: toDate
    })
        .then(response => {
            console.log('Book loan data saved:', response.data);
            // Optionally, handle a successful response, like clearing the form or showing a success message

            fetchSuccessMsg("New Entry Added");
        })
        .catch(error => {
            console.error('Error saving book loan data:', error);
            fetchErrorMsg("An error has Occurd");
        });
}



function editLoanClick(id) {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`../popup/editLoan.php?loan_id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const editLoanPagePopUp = document.getElementById('editLoanPage');

            editLoanPagePopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                editLoanPagePopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));
}


function updateLoanClick(id) {
    const fromDate = document.getElementById('loan_from').value;
    const toDate = document.getElementById('loan_to').value;
    const loanStatus = document.getElementById('loanStatus').value; // Get the selected loan status
    const loanFine = document.getElementById('loanFine').value; // Get the entered loan fine

    // Log values for verification
    console.log("Loan ID:", id);
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
    console.log("Loan Status:", loanStatus);
    console.log("Loan Fine:", loanFine);

    // Check if all required fields are filled
    if (!id || !fromDate || !toDate || !loanStatus) {
        alert("Please fill in all fields.");
        return;
    }

    // Send the data to the server for updating the loan via Axios
    axios.post('../db/php/editBookLoan-api.php', {
        id: id,
        from_date: fromDate,
        to_date: toDate,
        status: loanStatus,
        fine: loanFine
    })
        .then(response => {
            console.log('Loan updated:', response.data);
            // Handle a successful response, like showing a success message
            fetchSuccessMsg("Loan updated successfully.");
        })
        .catch(error => {
            console.error('Error updating loan:', error);
            fetchErrorMsg("An error occurred during the update.");
        });
}





function deleteLoanClick(id) {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`../popup/deleteLoan.php?loan_id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const deleteLoanPopUp = document.getElementById('deleteLoan');

            deleteLoanPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                deleteLoanPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));
}

function confirmDeleteLoan(loanId) {
    // Confirm deletion via Axios or Fetch API
    axios.post('../db/php/deleteLoan-api.php', { id: loanId })
        .then(response => {
            console.log('Loan deleted:', response.data);
            fetchSuccessMsg("Loan entry deleted successfully.");
            closePopup(); // Close the popup after successful deletion
        })
        .catch(error => {
            console.error('Error deleting loan:', error);
            fetchErrorMsg("An error occurred during deletion.");
        });
}


// LOAN <<<<<<<<<<<<<<<<<<<<<<<


























// Book Return>>>>>>>>>










document.addEventListener("DOMContentLoaded", function () {
    const returnsPerPage = 10;
    let booksCurrentPage = 1;

    // Function to fetch loans for the given page
    function fetchBookReturns(page) {
        const offset = (page - 1) * returnsPerPage;

        // Make the AJAX request to fetch loan data
        axios.get('../db/php/fetchBookReturn-api.php', {
            params: {
                page: page,
                limit: returnsPerPage
            }
        })
            .then(response => {
                // Update the table content with the fetched loans
                updateReturnsTable(response.data.loans);

                // Update the pagination links
                updateReturnsPagination(response.data.totalLoans, page);
            })
            .catch(error => {
                console.error('Error fetching returns data:', error);
            });
    }

    // Function to update the table with loan data
    function updateReturnsTable(loans) {
        const tbody = document.querySelector('.overdueTbl tbody');
        tbody.innerHTML = '';

        const pagination = document.getElementById('returnsPagination');

        if (loans.length === 0) {
            // Display a message if no loans are returned
            const noDataRow = document.createElement('tr');
            pagination.innerHTML = '';
            noDataRow.innerHTML = `
                <td colspan="7" style="text-align: center;">No pending Book Return.</td>
            `;
            tbody.appendChild(noDataRow);
        } else {
            loans.forEach((loan) => {
                const tr = document.createElement('tr');
                tr.classList.add('loan-row');
                tr.dataset.id = loan.user_id;
                tr.dataset.member = loan.member;
                tr.dataset.bookId = loan.book_id;
                tr.dataset.bookTitle = loan.book_title;
                tr.dataset.loanFrom = loan.loan_from;
                tr.dataset.loanTo = loan.loan_to;
                tr.dataset.status = loan.status;

                tr.dataset.fine = loan.loan_id;

                tr.innerHTML = `
                    <td>${loan.loan_id}</td>
                    <td>${loan.member}</td>
                    <td>${loan.book_title}</td>
                    <td>${loan.loan_from}</td>
                    <td>${loan.loan_to}</td>
                    <td>${loan.status}</td>
                    <td>
                        <div class="action-wrapper"> 
                            <i class='bx bx-check-square nav__icon' onclick="showConfirmBookReturn(${loan.loan_id})"></i>
                            <i class='bx bx-message-square-x nav__icon' onclick="showRejectBookReturn(${loan.loan_id})"></i> 
                        </div>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        }
    }


    // Function to update the pagination links
    function updateReturnsPagination(totalLoans, booksCurrentPage) {
        const totalPages = Math.ceil(totalLoans / returnsPerPage);
        const pagination = document.getElementById('returnsPagination');

        // Clear the current pagination links
        pagination.querySelectorAll('a.page-number').forEach(link => {
            link.remove();
        });

        // Add page numbers dynamically
        for (let page = 1; page <= totalPages; page++) {
            const li = document.createElement('a');
            li.classList.add('page-number');
            li.href = '#';
            li.innerHTML = `<li>${page}</li>`;

            if (page === booksCurrentPage) {
                li.classList.add('is-active');
            }
            li.onclick = (e) => {
                e.preventDefault();
                fetchLoans(page);
            };

            pagination.insertBefore(li, document.getElementById('next'));
        }







    }

    // Initially load loans for the first page


    const returnsPage = document.getElementById('returnsPage');

    if (returnsPage) {
        // Initially load users for the first page
        fetchBookReturns(booksCurrentPage);
        console.log('returnspage');
    }
});



function showConfirmBookReturn(id) {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`../popup/confirmBookReturn.php?loan_id=${id}`)  // Append the book ID to the URL
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const confirmBookReturnPopUp = document.getElementById('confirmBookReturn');

            confirmBookReturnPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                confirmBookReturnPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));
}


function confirmReturnClick(id) {



    // Send the data to the server for updating the loan via Axios
    axios.post('../db/php/confirmReturnBook-api.php', {
        id: id,
        status: 'Returned'

    })
        .then(response => {
            console.log('Loan updated:', response.data);
            // Handle a successful response, like showing a success message
            fetchSuccessMsg("Book Returned successfully.");
        })
        .catch(error => {
            console.error('Error updating loan:', error);
            fetchErrorMsg("An error occurred during the update.");
        });
}


function showRejectBookReturn(id) {
    popUpBg.classList.remove('hide');

    // Fetch the PHP content with the book ID appended to the URL
    fetch(`../popup/rejectBookReturn.php?loan_id=${id}`)
        .then(response => response.text())
        .then(data => {
            // Inject the content into the popup div
            popUpBg.innerHTML = data;

            const confirmBookReturnPopUp = document.getElementById('rejectBookReturn');

            confirmBookReturnPopUp.classList.remove('show');  // Ensure 'show' class is not there initially


            setTimeout(() => {
                // Now apply the 'show' class and trigger the transition
                confirmBookReturnPopUp.classList.add('show');

            }, 10);  // Small delay to allow the browser to register the initial styles


        })
        .catch(error => console.error('Error loading PHP content:', error));
}


function confirmRejectClick(id) {

    const rejectMsg = document.getElementById('rejectNotif');
    console.log("msg:" + rejectMsg.value);

    // Send the data to the server for updating the loan via Axios
    axios.post('../db/php/rejectReturnBook-api.php', {
        id: id,
        status: 'Rejected',
        msg: rejectMsg.value

    })
        .then(response => {
            console.log('Loan updated:', response.data);
            // Handle a successful response, like showing a success message
            fetchSuccessMsg("Book Return rejected successfully.");
        })
        .catch(error => {
            console.error('Error updating loan:', error);
            fetchErrorMsg("An error has occurred .");
        });
}





//  Book Return <<<<<<<<













// dashboard >>>>>>>>>>>>>>>>>>>
let overdueSearchQuery = '';
let overdueCurrentPage = 1;

function overdueSearch(event) {
    overdueSearchQuery = event.target.value.trim();
    overdueCurrentPage = 1; // Reset to the first page for new search results
    fetchOverdue(overdueCurrentPage, overdueSearchQuery);
}



let overduePerPage = 3;


// Function to fetch overdue loans for the given page
function fetchOverdue(page, overdueSearchQuery = '') {
    const offset = (page - 1) * overduePerPage;

    // Make the AJAX request to fetch overdue loan data
    axios.get('../db/php/dashboard/fetchOverdue-api.php', {
        params: {
            page: page,
            limit: overduePerPage,
            search: overdueSearchQuery // Pass the search query to the API
        }
    })
        .then(response => {
            // Update the table content with the fetched overdue loans
            updateOverdueTable(response.data.overdueLoans);

            document.getElementById('overdueBooks').innerText = response.data.overdueLoans.length;


            // Update the pagination links
            updateOverduePagination(response.data.totalOverdue, page);
        })
        .catch(error => {
            console.error('Error fetching overdue loan data:', error);
        });
}

// Function to update the table with overdue loan data
function updateOverdueTable(overdueLoans) {
    const tbody = document.getElementById('overdueTbody');
    tbody.innerHTML = '';





    const overdueTblPaginationContainer = document.getElementById('overdueTablePaginationContainer');



    if (overdueLoans.length === 0) {
        // Display a "No Results" row if no overdue loans are found
        overdueTblPaginationContainer.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="8" style="text-align: center;">No results found</td>
        `;
        tbody.appendChild(tr);
        return;
    }

    overdueLoans.forEach((loan, index) => {
        const tr = document.createElement('tr');
        tr.classList.add('loan-row');
        tr.dataset.id = loan.book_id;
        tr.dataset.member = loan.member;
        tr.dataset.book_title = loan.book_title;
        tr.dataset.author = loan.author;
        tr.dataset.loan_from = loan.loan_from;
        tr.dataset.loan_to = loan.loan_to;
        tr.dataset.status = loan.status;
        tr.dataset.fine = loan.fine;
        tr.dataset.days_overdue = loan.days_overdue;


        tr.innerHTML = `
            <td>${loan.user_id}</td>
            <td> <span> ${loan.member}  </span> </td> 
            <td><span> ${loan.book_title} </span> </td>
           
            <td>${loan.loan_from}</td>
            <td>${loan.loan_to}</td>
              <td>${loan.days_overdue} days</td>
            <td style="color: tomato;"> (${loan.fine ? `Fine: ₱${loan.fine}` : 'No Fine'})</td>
         
 
        `;


        tbody.appendChild(tr);

    });
}


// Function to update the pagination links
function updateOverduePagination(totalOverdues, overdueCurrentPage) {
    const totalPages = Math.ceil(totalOverdues / overduePerPage);
    const pagination = document.getElementById('overduePagination');


    if (pagination && pagination.innerHTML !== null && pagination.innerHTML.trim() !== '') {
        // Clear the current pagination links
        pagination.querySelectorAll('a.page-number').forEach(link => {
            link.remove();
        });

        // Add page numbers dynamically
        for (let page = 1; page <= totalPages; page++) {
            const li = document.createElement('a');
            li.classList.add('page-number');
            li.href = '#';
            li.innerHTML = `<li>${page}</li>`;

            if (page === overdueCurrentPage) {
                li.classList.add('is-active');
            }

            li.onclick = function (e) {
                e.preventDefault();
                fetchOverdue(page, overdueSearchQuery);
            };

            pagination.insertBefore(li, document.getElementById('next'));
        }


    }


}

const dashboard = document.getElementById('dashboard');


// dashbboard Onload Funtions
if (dashboard) {
    // Initially load overdues for the first page
    fetchOverdue(overdueCurrentPage);
    // Call the function to initialize the chart
    initializePaymentChart();
    initializeBookAvailabilityChart();
    console.log('fetchOverdue');

    // Initial fetch on page load
    fetchPayment(1);
    fetchDashboardHead();
    initializeCategoryChart();

    checkUserPlans();
}

function checkUserPlans() {
    axios.post('../db/php/dashboard/updateUserPlan-api.php')
        .then(function (response) {
            // Handle the success response
            if (response.data.status === 'success') {
                console.log(response.data.message);  // You can log the success message or handle it accordingly
                // alert(response.data.message);  // Optionally show an alert to the user
            } else {
                console.log('Error:', response.data.message);  // If something goes wrong
                alert('Error: ' + response.data.message);
            }
        })
        .catch(function (error) {
            // Handle any error in the request
            console.error('There was an error!', error);
            alert('There was an error processing your request.');
        });

}



function remindNearingOverdue() {
    axios.post('../db/php/dashboard/notifyNearingOverdue-api.php')
        .then(response => {
            console.log(response.data); // Log the full response for debugging
            if (response.data.status === 'success') {
                console.log('Notification saved successfully:', response.data.message); // Log success message



            } else {
                console.error('Error saving notification:', response.data.message); // Log the error message
            }
        })
        .catch(error => {
            console.error('Error in Axios request:', error);
        });
}



let paymentChartInstance = null; // Store the chart instance

function initializePaymentChart(month = new Date().getMonth() + 1) { // Default to current month
    axios.get(`../db/php/dashboard/paymentChart-api.php?month=${month}`)
        .then((response) => {
            // Assuming the response contains labels and data arrays
            const paymentchartData = response.data;

            // Select the chart container
            const paymentChartElement = document.querySelector('.payment-chart');

            // Destroy the existing chart if it exists
            if (paymentChartInstance) {
                paymentChartInstance.destroy();
            }

            // Render the new chart
            paymentChartInstance = new Chart(paymentChartElement, {
                type: 'doughnut',
                data: {
                    labels: paymentchartData.labels,
                    datasets: [
                        {
                            label: 'Payment',
                            data: paymentchartData.data,
                        },
                    ],
                },
                options: {
                    borderWidth: 10,
                    borderRadius: 10,
                    hoverBorderWidth: 0,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });

            // Calculate the total payment amount (sum of the data array)
            const totalAmount = paymentchartData.data.reduce((sum, amount) => sum + amount, 0);

            // Select the element where the total amount will be displayed
            const paymentCollection = document.getElementById('paymentCollection');

            // Display the total amount with the peso sign
            if (paymentCollection) {
                paymentCollection.innerHTML = `₱${totalAmount.toFixed(2)}`;
            } else {
                console.log('Payment collection element not found.');
            }

        })
        .catch((error) => {
            console.error('Error fetching payment data:', error);
        });
}






//   const populateUl = () => {
//     chartData.labels.forEach((l, i) => {
//       let li = document.createElement("li");
//       li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`;
//       ul.appendChild(li);
//     });
//   };

//   populateUl();



function initializeBookAvailabilityChart() {
    // Make an Axios request to fetch the data
    axios.get('../db/php/dashboard/bookAvailability-api.php')
        .then((response) => {
            // Assuming the response contains labels and data arrays for availability and borrowed books
            const bookAvailabilityData = response.data;

            // Select the chart container
            const bookAvailabilityChart = document.querySelector('.book-availability-chart');

            // Render the chart
            new Chart(bookAvailabilityChart, {
                type: 'doughnut',
                data: {
                    labels: bookAvailabilityData.labels,  // ["Available", "Borrowed"]
                    datasets: [
                        {
                            label: 'Book Availability',
                            data: bookAvailabilityData.data, // [Available count, Borrowed count]
                        },
                    ],
                },
                options: {
                    borderWidth: 10,
                    borderRadius: 10,
                    hoverBorderWidth: 0,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });

            // Calculate the total availability and borrowed books
            const totalBooks = bookAvailabilityData.data.reduce((sum, count) => sum + count, 0);
            const totalAvailable = bookAvailabilityData.data[0];
            const totalBorrowed = bookAvailabilityData.data[1];

            // Select the element where the total books count will be displayed
            const totalBooksElement = document.getElementById('totalBooks');

            // Display the total availability and borrowed books with the peso sign
            if (totalBooksElement) {
                totalBooksElement.innerHTML = `Total Books: ${totalBooks} | Available: ${totalAvailable} | Borrowed: ${totalBorrowed}`;
            } else {
                console.log('Total books element not found.');
            }

        })
        .catch((error) => {
            console.error('Error fetching book availability data:', error);
        });
}


function fetchDashboardHead(month) {
    axios.get('../db/php/dashboard/dashboard-head-api.php', {
        params: {
            month: month
        }
    })
    .then((response) => {
        // Assuming the response contains data in the 'data' object
        const data = response.data.data;

        // Access the values for paid members, borrowed books, users created, and popular books
        const paidMembers = data.paid_members;
        const borrowedBooks = data.borrowed_books;
        const usersCreated = data.users_created;
        const mostBorrowedBooks = data.most_borrowed_books; // Popular books

        // Update the page with the fetched data
        document.getElementById('paidMembers').innerText = paidMembers;
        document.getElementById('borrowedBooks').innerText = borrowedBooks;
        document.getElementById('usersCreated').innerText = usersCreated;

        // Render Popular Books
        const popularBooksContainer = document.querySelector('.sec-body');
        popularBooksContainer.innerHTML = ''; // Clear existing content

        if (mostBorrowedBooks && mostBorrowedBooks.length > 0) {
            mostBorrowedBooks.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('item');

                bookItem.innerHTML = `
                    <img src="${book.book_cover}" alt="Book Cover" />
                    <span class="title">${book.book_title}</span>
                    <span class="author">${book.author}</span>
                `;
                popularBooksContainer.appendChild(bookItem);
            });
        } else {
            popularBooksContainer.innerHTML = '<p>No books have been borrowed yet.</p>';
        }
    })
    .catch((error) => {
        console.error('Error fetching dashboard data:', error);
    });
}






let categoryBarChart = null; // Declare a global variable to hold the chart instance

function initializeCategoryChart(month = new Date().getMonth() + 1) {
    // Make an Axios request to fetch the data
    axios.get(`../db/php/dashboard/bookCategoryPopularity-api.php?month=${month}`)
        .then((response) => {
            // Assuming the response contains categories and loan_counts arrays
            const categoryData = response.data;

            // Select the chart container
            const categoryCtx = document.getElementById('categoryChart').getContext('2d');

            // Destroy the existing chart if it exists
            if (categoryBarChart !== null) {
                categoryBarChart.destroy();
            }

            // Create the bar chart
            categoryBarChart = new Chart(categoryCtx, {
                type: 'bar', // Specify chart type
                data: {
                    labels: categoryData.categories, // X-axis labels (categories)
                    datasets: [{
                        label: 'Book Category Popularity', // Label for the dataset
                        data: categoryData.loan_counts, // Data values for the bars (loan counts)
                        backgroundColor: categoryData.loan_counts.map((_, index) => {
                            // Add a different color for each bar based on the index
                            const colors = [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 206, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                                'rgba(255, 159, 64, 0.5)'
                            ];
                            return colors[index % colors.length]; // Loop through the colors
                        }),
                        borderColor: categoryData.loan_counts.map((_, index) => {
                            // Add a border color for each bar
                            const borderColors = [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ];
                            return borderColors[index % borderColors.length];
                        }),
                        borderWidth: 1 // Thickness of the bar borders
                    }]
                },
                options: {
                    responsive: true, // Make the chart responsive
                    plugins: {
                        legend: {
                            display: true, // Show the legend
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true // Start y-axis from 0
                        }
                    }
                }
            });

        })
        .catch((error) => {
            console.error('Error fetching book category data:', error);
        });
}





// Dashboard >>>>>>>>>>>>>>>>>>> 
let selectedMonth = new Date().getMonth() + 1; // Default to the current month (1-based index)

// Function to handle search input changes
function paymentSearch(event) {
    paymentSearchQuery = event.target.value.trim();
    paymentCurrentPage = 1; // Reset to the first page for new search results
    fetchPayment(paymentCurrentPage, paymentSearchQuery, selectedMonth);
}

// Function to fetch payment data for the given page, search query, and selected month
function fetchPayment(page, paymentSearchQuery = '', month = null) {
    const offset = (page - 1) * paymentPerPage;

    // Make the AJAX request to fetch payment data
    axios.get('../db/php/dashboard/fetchPayments-api.php', {
        params: {
            page: page,
            limit: paymentPerPage,
            search: paymentSearchQuery, // Pass the search query to the API
            month: month // Pass the selected month to the API
        }
    })
        .then(response => {
            // Update the table content with the fetched payments
            updatePaymentTable(response.data.payments);

            // Update the pagination links
            updatePaymentPagination(response.data.totalPayments, page);
        })
        .catch(error => {
            console.error('Error fetching payment data:', error);
        });
}

// Function to handle month selection changes
function changeMonth() {
    selectedMonth = document.getElementById("month").value; // Get the selected month
    paymentCurrentPage = 1; // Reset to the first page
    fetchPayment(paymentCurrentPage, paymentSearchQuery, selectedMonth); // Fetch payments for the selected month
    initializePaymentChart(selectedMonth);
    fetchDashboardHead(selectedMonth);
    initializeCategoryChart(selectedMonth);

}

// Function to update the table with payment data
function updatePaymentTable(payments) {
    const tbody = document.getElementById('paymentTbl');
    tbody.innerHTML = '';

    const paymentsPaginationContainer = document.getElementById('paymentsPaginationContainer');

    if (payments.length === 0) {
        // Display a "No Results" row if no payments are found
        // paymentsPaginationContainer.innerHTML = '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="8" style="text-align: center;">No results found</td>
        `;
        tbody.appendChild(tr);
        return;
    }

    payments.forEach(payment => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${payment.user_id}</td>
            <td>${payment.member}</td>
            <td>${payment.payment_type}</td>
            <td style="color:mediumseagreen;"> ₱ ${payment.amount}</td>
            <td>${payment.payment_date}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Function to update the pagination links
function updatePaymentPagination(totalPayments, paymentCurrentPage) {
    const totalPages = Math.ceil(totalPayments / paymentPerPage);
    const pagination = document.getElementById('paymentPagination');

    // Clear the current pagination links   
    pagination.innerHTML = '';

    // Add page numbers dynamically
    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement('a');
        li.classList.add('page-number');
        li.href = '#';
        li.innerHTML = `<li>${page}</li>`;

        if (page === paymentCurrentPage) {
            li.classList.add('is-active');
        }

        li.onclick = function (e) {
            e.preventDefault();
            fetchPayment(page, paymentSearchQuery, selectedMonth);
        };

        pagination.appendChild(li);
    }

}

// dashboard <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

