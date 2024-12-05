


<div class="users-section">

 <h2>Settings</h2>   
<div class="settings-nav">
        <?php
        // Set active page for highlighting
        $activePage = isset($_GET['page']) ? $_GET['page'] : 'settings';
        ?>

        <a href="?page=settings" class="row <?php echo $activePage == 'settings' ? 'active' : ''; ?>">
            <div class="left">
            <!-- <i class='bx bx-user'></i> -->
                <span class="underline-hover-animation">User Info</span>
            </div>
            <!-- <i class='bx bx-chevron-right' ></i> -->
        </a>

        <a href="?page=password" class="row <?php echo $activePage == 'password' ? 'active' : ''; ?>">
            <div class="left">
            <!-- <i class='bx bx-lock-open-alt' ></i> -->
                <span class="underline-hover-animation">Password & Security</span>
            </div>
            <!-- <i class='bx bx-chevron-right' ></i> -->
        </a>

        <a href="?page=notifications" class="row <?php echo $activePage == 'notifications' ? 'active' : ''; ?>">
            <div class="left">
            <!-- <i class='bx bx-bell' ></i> -->
                <span class="underline-hover-animation">Notifications</span>
            </div>
            <!-- <i class='bx bx-chevron-right' ></i> -->
        </a>

        <a href="?page=subscription" class="row <?php echo $activePage == 'subscription' ? 'active' : ''; ?>">
            <div class="left">
            <!-- <i class='bx bx-card' ></i> -->
                <span class="underline-hover-animation">Subscription</span>
            </div>
            <!-- <i class='bx bx-chevron-right' ></i> -->
        </a>
    </div>


    <div class="user-profile">
       

    
<form action="" class="user-profile-form">

<b>Change User Information Here </b>

<div class="row4">
 
        <div>
            <label for="current-password">Current Password</label>
            <input type="password" id="current-password" name="current-password" required>
        </div>

        <div>
            <label for="new-password">New Password</label>
            <input type="password" id="new-password" name="new-password" required>
        </div>

        <div>
            <label for="confirm-password">Confirm New Password</label>
            <input type="password" id="confirm-password" name="confirm-password" required>
        </div>

        <div>
            
        </div>
  
</div>




<button type="button" onclick="changePasswordClick()">Change Password</button>



</form>

    


    </div>

</div>

 