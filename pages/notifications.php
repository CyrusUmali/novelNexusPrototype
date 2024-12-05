<div class="users-section">


    <h2>Settings</h2>
    <div class="settings-nav">
        <?php
        // Set active page for highlighting
        $activePage = isset($_GET['page']) ? $_GET['page'] : 'settings';
        ?>

        <a href="?page=settings" class="row  <?php echo $activePage == 'settings' ? 'active' : ''; ?>">
            <div class="left">
                <!-- <i class='bx bx-user'></i> -->
                <span class="underline-hover-animation">User Info</span>
            </div>
            <!-- <i class='bx bx-chevron-right'></i> -->
        </a>

        <?php if ($userPasswordNotNull): ?>
            <a href="?page=password" class="row <?php echo $activePage == 'password' ? 'active' : ''; ?>">
                <div class="left">
                    <!-- <i class='bx bx-lock-open-alt'></i> -->
                    <span class="underline-hover-animation">Password & Security</span>
                </div>
                <!-- <i class='bx bx-chevron-right'></i> -->
            </a>
        <?php endif; ?>



        <a href="?page=notifications" class="row <?php echo $activePage == 'notifications' ? 'active' : ''; ?>">
            <div class="left">
                <!-- <i class='bx bx-bell'></i> -->
                <span class="underline-hover-animation">Notifications</span>
            </div>
            <!-- <i class='bx bx-chevron-right'></i> -->
        </a>

        <a href="?page=subscription" class="row <?php echo $activePage == 'subscription' ? 'active' : ''; ?>">
            <div class="left">
                <!-- <i class='bx bx-card'></i> -->
                <span class="underline-hover-animation">Subscription</span>
            </div>
            <!-- <i class='bx bx-chevron-right'></i> -->
        </a>
    </div>



    <div class="user-notifications" id="notifPage">

        <div class="head">
            <i class='bx bx-bell'></i>
            <span> Notifications</span>
        </div>


        <div id="notifPageContent" class="notifPageContent">

        </div>

        <!-- <div class="row">

                <img src="" alt="">

                <div class="notif-content">

                    <b>Admin</b>
                    Your book 'A blablas Tale' is Due to be Returned 2 days from now.

                </div>

            </div>


            <div class="row">

                <img src="" alt="">

                <div class="notif-content">

                    <b>Admin</b>
                    Your Membership subscription ends in 3 days;

                </div>

            </div> -->












    </div>

</div>