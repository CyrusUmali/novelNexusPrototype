 
<body>

    <div class="books-page">

        <div class="block">

            <div class="greeting-wrapper">
                <h2>Today's Quote</h2>

                <p>"Dont Book the Cover By its Judge"</p>

                <span>-Giga CHad</span>

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


                </div> -

                <div class="right">

                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>

                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>

                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>

                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>


                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>

                    <div class="item">

                        <img src="" alt="">

                        <span>
                            Fiction
                        </span>

                    </div>

                </div>

            </div>

        </div>






        <h2 style="color: #4d4d4d;">Good Morning</h2>

        <div class="label">

            <span>Recommendation for you</span>

            <span>Show All</span>

        </div>

        <div class="books-wrapper">



            <ul>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>

                <li data-page="book-prev">

                    <img>

                    <span class="title">Book Title</span>
                    <span class="author">Author</span>
                    <span class="rating">Rating</span>


                </li>





            </ul>

        </div>


    </div>


    <script>
        // Attach a click event listener to each <li> inside .books-wrapper
        document.querySelectorAll('.books-wrapper ul li').forEach((li) => {
            li.addEventListener('click', () => {
                // Use a relative URL to navigate
                window.location.href = `?page=${li.dataset.page}`;
            });
        });
    </script>

</body>

 