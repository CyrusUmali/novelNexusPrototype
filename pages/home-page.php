 <div class="block" id="home-page">

     <div class="greeting-wrapper">
         <h2>Today's Quote</h2>

         <p>"Don't judge a book by its cover"</p>

         <span>-George Eliot</span>

         <div class="wrapper">

             <i></i>
             <i></i>
             <i></i>
             <i></i>

         </div>
     </div>

     <div class="home-categories-wrapper">
         <div class="left">
             <span>Categories</span>
         </div>

         <div class="right">
             <?php
                // Fetch categories
                $sql = "SELECT id, name, photo FROM category";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo '<div class="item" onclick="setActiveCategory(this, ' . $row['id'] . ')">';
                        echo '<img src="' . $row['photo'] . '" alt="' . htmlspecialchars($row['name']) . '">';
                        echo '<span>' . htmlspecialchars($row['name']) . '</span>';
                        echo '</div>';
                    }
                } else {
                    echo "No categories found.";
                }
                ?>
         </div>
     </div>



 </div>






 <h2 style="color: #4d4d4d;">Good Morning</h2>

 <div class="label">

     <span>Recommendation for you</span>

     <a href="index.php?page=search-book" style="color: dimgray;"> <span> Show All</span>
     </a>

 </div>

 <div class="books-wrapper">



     <ul>


         <?php
            // Fetch categories
            $sql = "SELECT id, title, author, book_cover FROM books";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo '<li data-page="book-prev" onclick="viewBookClick(' . $row['id'] . ')">';
                    echo '<img src="' . htmlspecialchars($row['book_cover']) . '" alt="' . htmlspecialchars($row['title']) . '">';
                    echo '<span class="title">' . htmlspecialchars($row['title']) . '</span>';
                    echo '<span class="author">' . htmlspecialchars($row['author']) . '</span>';
                    echo '<span class="rating">Rating</span>';
                    echo '</li>';
                }
            } else {
                echo "No categories found.";
            }
            ?>


         <li data-page="book-prev">

             <img>

             <span class="title">Book Title</span>
             <span class="author">Author</span>
             <span class="rating">Rating</span>


         </li>




     </ul>

 </div>




 <script src="./user.js"></script>