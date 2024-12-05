<?php
// Query for the most borrowed books
$query_most_borrowed_books = "
    SELECT b.title AS book_title, b.author, b.book_cover, COUNT(l.id) AS borrow_count
    FROM loans l
    JOIN books b ON l.book_id = b.id
    GROUP BY b.id
    ORDER BY borrow_count DESC
    LIMIT 7
";
$result_most_borrowed = $conn->query($query_most_borrowed_books);

$most_borrowed_books = [];
while ($row = $result_most_borrowed->fetch_assoc()) {
    $most_borrowed_books[] = $row;
}

// If the retrieved books are less than 7, fetch random books to make up the difference
if (count($most_borrowed_books) < 7) {
    $remaining_count = 7 - count($most_borrowed_books);

    $query_random_books = "
        SELECT title AS book_title, author, book_cover
        FROM books
        WHERE id NOT IN (
            SELECT DISTINCT book_id
            FROM loans
        )
        ORDER BY RAND()
        LIMIT $remaining_count
    ";
    $result_random_books = $conn->query($query_random_books);

    while ($row = $result_random_books->fetch_assoc()) {
        $most_borrowed_books[] = $row;
    }
}
?>



<?php
// Query for the latest 4 books
$query_latest_books = "
    SELECT title AS book_title, author, book_cover, about
    FROM books 
    LIMIT 4
";
$result_latest_books = $conn->query($query_latest_books);

$latest_books = [];
while ($row = $result_latest_books->fetch_assoc()) {
    $latest_books[] = $row;
}
?>




<section class="first-section">

    <div class="left">


        <h1>
            Welcome to our Library
        </h1>

        <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto dolor odio quo esse voluptatem
            nam! Eaque dolores dolore repudiandae cupiditate distinctio laboriosam quod. Maxime incidunt odio
            minus officia ullam eos?
        </p>

        <div>

            <button class="register" onclick="logInClick()">Register</button>
            <!-- <button class="learn">Learn More</button> -->

        </div>

    </div>

    <div class="right">

        <img src="./resources/library-bg1.png" alt="">

    </div>



</section>

<section class="second-section">

    <div class="wrapper">

        <div class="sec-header">
            <h3>Popular Books</h3>
        </div>
        <div class="sec-body">
            <?php if (!empty($most_borrowed_books)): ?>
                <?php foreach ($most_borrowed_books as $book): ?>
                    <div class="item">
                        <img src="<?php echo htmlspecialchars($book['book_cover']); ?>" alt="Book Cover" />
                        <span class="title"><?php echo htmlspecialchars($book['book_title']); ?></span>
                        <span class="author"><?php echo htmlspecialchars($book['author']); ?></span>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No books have been borrowed yet.</p>
            <?php endif; ?>
        </div>



    </div>





</section>

<section class="third-section">
    <div class="wrapper">
        <div class="left">
            <?php if (!empty($latest_books)): ?>
                <div class="sec-col1">
                    <h1>Latest Books</h1>
                    <img src="<?php echo htmlspecialchars($latest_books[0]['book_cover']); ?>" alt="Book Cover">
                    <span><?php echo htmlspecialchars($latest_books[0]['book_title']); ?></span>
                </div>
                <div class="sec-col2">
                    <div class="sec-row1">
                        <span><?php echo htmlspecialchars($latest_books[0]['author']); ?></span>
                    </div>
                    <div class="sec-row2">
                        <span>About the Book</span>
                    </div>
                    <div class="sec-row3">
                        <!-- Display the book's about content -->
                        <?php echo $latest_books[0]['about']; ?>
                    </div>
                    <div class="sec-row4">
                        <button class="borrow" onclick="logInClick()">Borrow Now</button>
                        <button class="read" onclick="logInClick()">Read Later</button>
                    </div>
                </div>
            <?php else: ?>
                <p>No books available.</p>
            <?php endif; ?>
        </div>

        <div class="right">
            <?php if (count($latest_books) > 1): ?>
                <?php for ($i = 1; $i < count($latest_books); $i++): ?>
                    <div class="sec-row4">
                        <div class="col">
                            <span class="title"><?php echo htmlspecialchars($latest_books[$i]['book_title']); ?></span>
                            <span class="genre">Genre</span>
                            <span class="about">
                                <?php echo $latest_books[$i]['about']; ?>
                            </span>
                            <a onclick="logInClick()">Read more</a>
                        </div>
                        <img src="<?php echo htmlspecialchars($latest_books[$i]['book_cover']); ?>" alt="Book Cover">
                    </div>
                <?php endfor; ?>
            <?php else: ?>
                <p>No additional books available.</p>
            <?php endif; ?>
        </div>
    </div>
</section>