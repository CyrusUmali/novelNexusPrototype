<?php

if (isset($_SESSION['userInfo'][0])) {
    $userInfo = $_SESSION['userInfo'][0];

    if (isset($userInfo['id'])) {
        $customerId = $userInfo['id'];

        // Fetch user and plan information
        $query = "
            SELECT 
                u.subscription_start, 
                u.subscription_end, 
                p.name AS plan_name, 
                p.price ,
                p.borrowing_period,
                p.fine_per_day , 
                p.features,
                p.max_books
            FROM 
                users u 
            INNER JOIN 
                plans p 
            ON 
                u.plan_id = p.id 
            WHERE 
                u.id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $customerId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $subscriptionData = $result->fetch_assoc();

            // Assign variables for rendering
            
            $max_books = htmlspecialchars($subscriptionData['max_books']);
            $planName = htmlspecialchars($subscriptionData['plan_name']);
            $price = htmlspecialchars($subscriptionData['price']);
            $borrowing_period = htmlspecialchars($subscriptionData['borrowing_period']);
            $fine_per_day = htmlspecialchars($subscriptionData['fine_per_day']);
            $features = htmlspecialchars($subscriptionData['features']);
            $subscriptionStart = htmlspecialchars($subscriptionData['subscription_start']);
            $subscriptionEnd = $subscriptionData['subscription_end']; // Keep as-is for null check
        } else {
            echo "No subscription found for the user.";
            exit;
        }

        // Fetch fines data (if applicable)
        $finesQuery = "SELECT SUM(fine) AS total_fines FROM loans WHERE user_id = ? AND paid = 0 AND status ='Returned'";
        $finesStmt = $conn->prepare($finesQuery);
        $finesStmt->bind_param("i", $customerId);
        $finesStmt->execute();
        $finesResult = $finesStmt->get_result();

        if ($finesResult->num_rows > 0) {
            $finesData = $finesResult->fetch_assoc();
            $totalFines = $finesData['total_fines'];
        } else {
            $totalFines = 0;
        }
    } else {
        echo "User ID not found in session.";
        exit;
    }
} else {
    echo "User information not found in session.";
    exit;
}
?>

<div class="users-section" id="Subscription-page">

    <h2>Settings</h2>
    <div class="settings-nav">
        <?php
        // Set active page for highlighting
        $activePage = isset($_GET['page']) ? $_GET['page'] : 'settings';
        ?>

        <a href="?page=settings" class="row <?php echo $activePage == 'settings' ? 'active' : ''; ?>">
            <div class="left">
                <span class="underline-hover-animation">User Info</span>
            </div>
        </a>

        <?php if ($userPasswordNotNull): ?>
            <a href="?page=password" class="row <?php echo $activePage == 'password' ? 'active' : ''; ?>">
                <div class="left">
                    <span class="underline-hover-animation">Password & Security</span>
                </div>
            </a>
        <?php endif; ?>

        <a href="?page=notifications" class="row <?php echo $activePage == 'notifications' ? 'active' : ''; ?>">
            <div class="left">
                <span class="underline-hover-animation">Notifications</span>
            </div>
        </a>

        <a href="?page=subscription" class="row <?php echo $activePage == 'subscription' ? 'active' : ''; ?>">
            <div class="left">
                <span class="underline-hover-animation">Subscription</span>
            </div>
        </a>
    </div>

    <div class="user-profile">
        <b>Subscription</b>

        <div class="subscription-wrapper">

            <div class="item">
                <span class="plan">Current Plan</span>
                <div class="subs">
                    <b><?php echo $planName; ?></b>
                    <span>₱<?php echo $price; ?> per month</span>

                    <!-- Plan details -->
                    <span>-₱<?php echo $fine_per_day;  ?> Fines per day (Overdue Books)</span>
                    <span>-<?php echo $borrowing_period;  ?> Days Borrowing Period</span>
                    <span>-<?php echo $max_books;  ?> Max Books</span>
               

                    <div class="action-wrapper">
                        <a href="?page=pricing">
                            <button class="btn-1">Upgrade Plan</button>
                        </a>
                        <?php if ($planName !== 'Free'): ?>
                            <button class="btn-2" onclick="cancelPlan()">Cancel Plan</button>
                        <?php endif; ?>
                    </div>
                    <?php if (!is_null($subscriptionEnd)): ?>
                        <span>
                            Your plan expires on <?php echo date('F j, Y', strtotime($subscriptionEnd)); ?>
                        </span>
                    <?php endif; ?>
                </div>
            </div>

            <div style="border-right: 1px solid whitesmoke; height:100%"></div>


            <div class="item">
                <span class="plan">Fines</span>
                <div class="subs">
                    <span>$<?php echo number_format($totalFines, 2); ?></span>
                    <?php if ($totalFines > 0): ?>
                        <div class="action-wrapper">
                            <button class="btn-1" onclick="payUserFines(<?php echo ($totalFines); ?>)">Pay Fines</button>
                            <button class="btn-2" onclick="viewFines()">View Details</button>
                        </div>

                    <?php endif; ?>


                </div>
            </div>


        </div>
    </div>

</div>