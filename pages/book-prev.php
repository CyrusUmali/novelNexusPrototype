<?php
// Include database connection
include './db/conn.php';

// Check if 'id' is set in the URL
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $bookId = $_GET['id'];

    // Prepare the SQL query to retrieve the book data and categories based on the provided id
    $sql = "SELECT category.name FROM category
            JOIN bookCategories ON category.id = bookCategories.category_id
            WHERE bookCategories.book_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $bookId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if categories were found
    if ($result->num_rows > 0) {
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['name'];  // Store category names in an array
        }
    } else {
        die("No categories found for this book.");
    }

    // Fetch the book data
    $sqlBook = "SELECT * FROM books WHERE id = ?";
    $stmtBook = $conn->prepare($sqlBook);
    $stmtBook->bind_param("i", $bookId);
    $stmtBook->execute();
    $bookResult = $stmtBook->get_result();

    if ($bookResult->num_rows > 0) {
        // Fetch the book data
        $book = $bookResult->fetch_assoc();
        $isbn = $book['isbn']; // Retrieve ISBN from the result
    } else {
        die("Book not found.");
    }

    $user_id = $_SESSION['userInfo'][0]['id']; // Assuming session is already started
    $sqlShelf = "SELECT 1 FROM shelf WHERE user_id = ? AND book_id = ?";
    $stmtShelf = $conn->prepare($sqlShelf);
    $stmtShelf->bind_param("ii", $user_id, $bookId);
    $stmtShelf->execute();
    $shelfResult = $stmtShelf->get_result();

    $isInShelf = $shelfResult->num_rows > 0; // True if the book is in the user's shelf

    // Close all statements
    $stmtBook->close();
    $stmt->close();
    $stmtShelf->close();

    // Close the database connection
    $conn->close();

    // Now you can use $book, $categories, and $isInShelf in your PHP logic
} else {
    die("No valid ID provided.");
}
?>





<?php

// Include database connection
include './db/conn.php';

// Assuming the logged-in user's ID is stored in the session
$user_id = $_SESSION['userInfo'][0]['id'];
$bookId = $book['id']; // The current book's ID

// Query to fetch the user's rating and review content for this book
$query = "SELECT id, rating, review_content FROM bookReviews WHERE user_id = ? AND book_id = ? LIMIT 1";
$statement = $conn->prepare($query);
$statement->bind_param("ii", $user_id, $bookId);
$statement->execute();
$result = $statement->get_result();
$existingRating = 0;
$reviewContent = null; // Default value for review_content

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $existingRating = $row['rating'];;
    $reviewContent = $row['review_content']; // Get the review content
    $reviewId = $row['id'];
}

$statement->close();
?>



<style>
    .main .content {
        background-color: #f7f7f7;
    }
</style>




<!-- book prev -->
<div class="book-prev" id="bookPrev">



    <div class="book-1">

        <!-- Display current cover image if available -->
        <?php if (!empty($book['book_cover'])): ?>
            <img src="<?php echo htmlspecialchars($book['book_cover']); ?>" alt="Current Book Cover">
        <?php else: ?>
            <img src="" alt="No cover image">
        <?php endif; ?>

        <!-- Check if the book is available -->
        <?php if ($book['Availability'] === 'Available'): ?>
            <button class="btn-1" onclick="borrowBookClick(<?php echo htmlspecialchars($book['id']); ?>)">Borrow Book</button>
        <?php else: ?>
            <button class="btn-2" disabled>Not Available</button>
        <?php endif; ?>





        <?php
        // Example button rendering logic
        if (isset($isInShelf)) { // Check if the variable is set
            if ($isInShelf) {
                echo '<button class="btn-3" onclick="removeFromShelfPrev(' . htmlspecialchars($bookId) . ')">Remove from Shelf</button>';
            } else {
                echo '<button class="btn-3" onclick="addToShelfPrev(' . htmlspecialchars($bookId) . ')">Add to Shelf</button>';
            }
        } else {
            echo '<p>Error: Shelf status is not available.</p>';
        }
        ?>



        <div class="rating-wrapper" onmouseout="resetRating()">
            <div id="stars-container" class="stars-container"></div>
            <span id="rating-text" onclick="rateBookClick(<?php echo htmlspecialchars($book['id']); ?>)">Rate this book</span>
        </div>


    </div>

    <div class="book-2">

        <div class="block-1" style="margin-top:40px">


            <h1 class="title"><?php echo htmlspecialchars($book['title']); ?></h1>
            <span class="author2"><?php echo htmlspecialchars($book['author']); ?>

            </span>


            <div class="rating">
                <div>



                    <?php

                    // Assuming the logged-in user's ID is stored in the session
                    $user_id = $_SESSION['userInfo'][0]['id'];
                    $bookId = $book['id']; // The current book's ID

                    // Query to fetch the user's rating and review content for this book
                    $query = "SELECT id, rating, review_content FROM bookReviews WHERE user_id = ? AND book_isbn = ? LIMIT 1";
                    $statement = $conn->prepare($query);
                    $statement->bind_param("is", $user_id, $isbn);
                    $statement->execute();
                    $result = $statement->get_result();
                    $existingRating = 0;
                    $reviewContent = null; // Default value for review_content

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $existingRating = $row['rating']; // This is the user's rating for this book
                        $reviewContent = $row['review_content']; // Get the review content
                        $reviewId = $row['id'];
                    }

                    $statement->close();

                    // Query to fetch the average rating, total ratings, and total reviews for this book
                    $ratingQuery = "SELECT 
                    AVG(rating) AS average_rating, 
                    COUNT(rating) AS total_ratings, 
                    COUNT(CASE WHEN review_content IS NOT NULL THEN 1 END) AS total_reviews 
                FROM bookReviews 
                WHERE book_isbn = ?";
                    $ratingStatement = $conn->prepare($ratingQuery);
                    $ratingStatement->bind_param("s", $isbn);
                    $ratingStatement->execute();
                    $ratingResult = $ratingStatement->get_result();

                    $averageRating = 0;
                    $totalRatings = 0;
                    $totalReviews = 0;

                    if ($ratingResult->num_rows > 0) {
                        $ratingRow = $ratingResult->fetch_assoc();
                        $averageRating = $ratingRow['average_rating'];
                        $totalRatings = $ratingRow['total_ratings'];
                        $totalReviews = $ratingRow['total_reviews'];
                    }

                    $ratingStatement->close();
                    ?>




                    <?php
                    // Calculate the number of full, half, and empty stars based on the average rating
                    $fullStars = floor($averageRating); // Full stars based on the average rating
                    $halfStars = ($averageRating - $fullStars) >= 0.5 ? 1 : 0; // Check for half star
                    $emptyStars = 5 - ($fullStars + $halfStars); // Empty stars to fill up to 5

                    // Display full stars
                    for ($i = 0; $i < $fullStars; $i++) {
                        echo "<i class='bx bxs-star'></i>"; // Solid (filled) star
                    }

                    // Display half star if applicable
                    if ($halfStars) {
                        echo "<i class='bx bxs-star-half'></i>"; // Half star
                    }

                    // Display empty stars
                    for ($i = 0; $i < $emptyStars; $i++) {
                        echo "<i class='bx bx-star'></i>"; // Empty star
                    }
                    ?>
                </div>

                <h2 class="score"><?php echo number_format($averageRating, 2); ?></h2>

                <span class="numOfRatings"><?php echo $totalRatings; ?> ratings</span>
                <span class="numOfReviews"><?php echo $totalReviews; ?> reviews</span>
            </div>


            <div class="book-summary">

                <?php echo html_entity_decode($book['about']); ?>


            </div>

            <br>
            <!-- HTML to display book details and categories -->
            <div class="genre-wrapper">
                <label>Category</label>
                <?php
                // Display categories
                if (!empty($categories)) {
                    foreach ($categories as $category) {
                        echo "<span>" . htmlspecialchars($category) . "</span>";
                    }
                } else {
                    echo "<span>No categories available</span>";
                }
                ?>
            </div>
            <br>
            <hr>

        </div>

        <div class="block-1">

            <h2>Recommendation for You</h2>



            <div class="recommendation-wrapper">
                <ul>
                    <?php
                    // Fetch random 4 books
                    $sql = "SELECT id, title, author, book_cover FROM books ORDER BY RAND() LIMIT 4";
                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo '<li data-page="book-prev" onclick="viewBookClick(' . $row['id'] . ')">';
                            echo '<img src="' . htmlspecialchars($row['book_cover']) . '" alt="' . htmlspecialchars($row['title']) . '">';
                            echo '<span class="title">' . htmlspecialchars($row['title']) . '</span>';
                            echo '<span class="author">' . htmlspecialchars($row['author']) . '</span>';

                            echo '</li>';
                        }
                    } else {
                        echo "<li>No books found.</li>";
                    }
                    ?>
                </ul>

                <hr>
            </div>



        </div>




        <!-- <div class="block-1">

            <b>About the Author</b>

            <div class="author-name">

                <img>

                <span class="author"><?php echo htmlspecialchars($book['author']); ?></span>

            </div>

            <div class="author-details">

                Cherie Priest is the author of two dozen books and novellas, most recently The Toll, The Family
                Plot, The Agony House, and the Philip K. Dick Award nominee Maplecroft; but she is perhaps best
                known for the steampunk pulp adventures of the Clockwork Century, beginning with Boneshaker. Her
                works have been nominated for the Hugo and Nebula awards for science fiction, and have won the
                Locus Award (among others) – and over the years, they’ve been translated into nine languages in
                eleven countries. Cherie lives in Seattle, WA, with her husband and a menagerie of exceedingly
                photogenic pets.

            </div>

            <div class="other-works">

                <span>Other Books</span>

                <div class="wrapper">

                    <img>
                    <img>


                </div>

            </div>








        </div> -->

        <div class="block-1" id="myReviewContainer">


            <?php if ($reviewContent === NULL && $existingRating === 0): ?>



                <h2>Ratings & Reviews</h2>

                <div class="make-Review-wrapper" id="make-Review">

                    <img src="<?php echo htmlspecialchars($userPhoto); ?>" alt="User Profile">


                    <div class="review-message">

                        <i>What do you think ?</i>

                    </div>

                    <div class="write-review-control">

                        <div class="rating-wrapper" onmouseout="resetRating()">
                            <div id="stars-container" class="stars-container"></div>
                            <span id="rating-text" onclick="rateBookClick(<?php echo htmlspecialchars($book['id']); ?>)">Rate this book</span>
                        </div>




                        <button id="writeReviewBtn" onclick="writeReviewClick(<?php echo htmlspecialchars($book['id']); ?>)">
                            Write a Review
                        </button>

                    </div>

                    <div class="review-content">
                        <div id="editor"></div>
                    </div>


                </div>


            <?php elseif ($reviewContent === NULL && $existingRating > 0): ?>

                <h2>Ratings & Reviews</h2>

                <h3>My Review</h3>

                <div class="rr-wrapper" id="make-Review">

                    <div class="item">  

                        <div class="left">

                            <img src="<?php echo htmlspecialchars($userPhoto); ?>" alt="User Profile">
                            <span class="name">

                                <?php

                                $userInfo = $_SESSION['userInfo'][0];
                                echo $userInfo['fname'];


                                ?>

                            </span>

                        </div>

                        <div class="right">

                            <div class="row-1">

                                <div class="col-1">


                                    <div class="rating-wrapper">

                                        <div class="stars-container">
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                        </div>


                                    </div>


                                </div>

                                <div class="col-2">

                                    <!-- November 11, 2012 -->

                                </div>



                            </div>

                            <div class="review-content">

                                <div id="editor"></div>

                            </div>



                            <button id="writeReviewBtn" style="margin-top: 10px;" onclick="writeReviewClick(<?php echo htmlspecialchars($book['id']); ?>)">
                                Write a Review
                            </button>

                        </div>

                    </div>


                </div>


            <?php else: ?>


                <h2>Ratings & Reviews</h2>



                <div class="item-header">
                    <h3>My Review</h3>
                    <i class="bx bx-trash alt  " onclick="deleteReviewPopup(<?php echo htmlspecialchars($reviewId); ?>)"></i>
                </div>

                <div class="rr-wrapper">

                    <div class="item">

                        <div class="left">

                            <img src="<?php echo htmlspecialchars($userPhoto); ?>" alt="User Profile">
                            <span class="name">

                                <?php

                                $userInfo = $_SESSION['userInfo'][0];
                                echo $userInfo['fname'];


                                ?>

                            </span>

                        </div>

                        <div class="right">

                            <div class="row-1">

                                <div class="col-1">


                                    <div class="rating-wrapper">

                                        <div class="stars-container">
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                            <i class='bx bx-star'></i>
                                        </div>


                                    </div>


                                </div>

                                <div class="col-2">

                                    November 11, 2012

                                </div>



                            </div>

                            <div class="review-content show">

                                <?php echo $reviewContent; // Output the raw HTML content  
                                ?>

                            </div>

                        </div>

                    </div>


                </div>



            <?php endif; ?>




            <hr>
        </div>


        <div class="block-1">
            <h2>Community Reviews</h2>
            <div class="rr-wrapper">
                <?php
                // Assuming you have fetched the review data
                $query = "SELECT br.id, br.rating, br.review_content, br.created_at, u.photo, u.fname
                  FROM bookReviews br
                  JOIN users u ON br.user_id = u.id
                  WHERE br.book_isbn = ?";

                $stmt = $conn->prepare($query);
                $stmt->bind_param('s', $isbn); // Bind the book_id parameter
                $stmt->execute();
                $result = $stmt->get_result();

                // Check if there are any rows returned
                if ($result->num_rows > 0) {
                    // Display the reviews
                    while ($row = $result->fetch_assoc()) {
                        $rating = $row['rating'];
                        $reviewContent = $row['review_content'];
                        $userPhoto = $row['photo']; // Get the user's photo
                        $fname = $row['fname']; // Get the user's photo
                ?>
                        <div class="item">
                            <div class="left">
                                <img src="<?php echo htmlspecialchars($userPhoto); ?>" alt="User Profile">
                                <span class="name">
                                    <?php echo ($fname); ?>
                                </span>
                            </div>

                            <div class="right">
                                <div class="row-1">
                                    <div class="col-1">
                                        <div class="rating-wrapper">
                                            <div>
                                                <?php
                                                // Loop to display filled or empty stars based on rating
                                                for ($i = 1; $i <= 5; $i++) {
                                                    if ($i <= $rating) {
                                                        echo "<i class='bx bxs-star'></i>"; // Filled star
                                                    } else {
                                                        echo "<i class='bx bx-star'></i>"; // Empty star
                                                    }
                                                }
                                                ?>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-2">
                                        <?php echo date("F j, Y", strtotime($row['created_at'])); ?>
                                    </div>
                                </div>

                                <div class="review-content show">
                                    <?php echo ($reviewContent); ?>
                                </div>
                            </div>
                        </div>
                <?php
                    }
                } else {
                    // If no reviews are found, display an image
                    echo '<img class="nReview" src="./resources/review.png" alt="No reviews available">';
                }
                ?>
            </div>
        </div>







    </div>


</div>