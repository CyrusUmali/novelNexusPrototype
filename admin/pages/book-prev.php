<?php
// Include database connection
include '../db/conn.php';

// Check if 'id' is set in the URL
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $bookId = $_GET['id'];

    // Prepare the SQL query to retrieve the book data based on the provided id
    $sql = "SELECT * FROM books WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $bookId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a book was found
    if ($result->num_rows > 0) {
        // Fetch the book data
        $book = $result->fetch_assoc();
    } else {
        echo "Book not found.";
        exit();
    }

    // Close the statement
    $stmt->close();
} else {
    echo "No valid ID provided.
    
    ";
    exit();
}

// Close the database connection
$conn->close();
?>




<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<style>
    .main .content {
        background-color: #f7f7f7;
    }
</style>

<body>


    <!-- book prev -->
    <div class="book-prev">



        <div class="book-1">

               <!-- Display current cover image if available -->
               <?php if (!empty($book['book_cover'])): ?>
                    <img  src="<?php echo htmlspecialchars($book['book_cover']); ?>" alt="Current Book Cover">
                <?php else: ?>
                    <img id="imagePreview" src="" alt="No cover image">
                <?php endif; ?>

            <button>Want to Read</button>


            <div class="rating-wrapper">

                <div>
                    <i class='bx bx-star'></i>
                    <i class='bx bx-star'></i>
                    <i class='bx bx-star'></i>
                    <i class='bx bx-star'></i>
                    <i class='bx bx-star'></i>
                </div>

                <span>Rate this book</span>

            </div>

        </div>

        <div class="book-2">

            <div class="block-1">


                <h1 class="title"><?php echo htmlspecialchars($book['title']); ?></h1>
                <span class="author"><?php echo htmlspecialchars($book['author']); ?></span>


                <div class="rating">

                    <div>
                        <i class='bx bx-star'></i>
                        <i class='bx bx-star'></i>
                        <i class='bx bx-star'></i>
                        <i class='bx bx-star'></i>
                        <i class='bx bx-star'></i>
                    </div>

                    <h2 class="score">3.52</h2>

                    <span class="numOfRatings">2921 ratings</span>
                    <span class="numOfReviews"> 123 reviews </span>

                </div>

                <div class="book-summary">

                <?php echo html_entity_decode($book['about']); ?>


                </div>

            </div>

            <div class="block-1">

            <span>Category</span>
                <div class="genre-wrapper">

                    <span>Steampunk</span>
                    <span>Fantasy</span>
                    <span>Scient Fiction</span>
                    <span>Zombies</span>
                    <span>Alternate History</span>

                </div>





            </div>

            <div class="block-1">

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








            </div>


            <div class="block-1">

                <b>Ratings & Reviews</b>

                <div class="rr-wrapper">

                    <div class="item">

                        <div class="left-item">

                            <img>
                            User Name

                        </div>

                        <div class="right-item">

                            <div class="head">

                                <div class="star">
                                    A A A A A
                                </div>


                                <div class="date">

                                    July 27, 2019

                                </div>
                            </div>

                            <div class="review-body">
                                The premise starts with a pretty standard troupe and immediately starts with the
                                immature commentary. The struggle of starting out is explained blandly and doesn't
                                add anything to his character. You could start the book at his trip away from home
                                because the author certainly does after hand waving 3 years and just giving him the
                                standard MC is a genius plot point. Next thing you know you are getting that Second
                                infusion of free power when a dragon just decides to fuse and give him a egg because
                                of course the protagonist wasn't strong enough. Wasn't even a little surprised that
                                he ended up jump cutting again just to send him home and spell out that he is the
                                damn avatar hokage pokemon master as soon as it's convenient. If he does that shit
                                where he cuts off part of a word as if he's interupting his own inner monologue any
                                more I'm going to cut a bi...
                            </div>




                        </div>

                    </div>


                </div>









            </div>




        </div>


    </div>


</body>

</html>