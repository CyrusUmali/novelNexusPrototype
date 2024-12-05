
function fetchNotifPage() {

    axios.get('./db/php/fetchNotif.php')
        .then(response => {
            const data = response.data;
            const notifContent = document.getElementById('notifPageContent');
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
                                    <span class="date">${new Date(notification.created_at).toLocaleDateString()} 
                                    <i class="bx bx-trash alt  " onclick="deleteNotif(${notification.id})"></i>
                                    </span>
                                     
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
                                    <span class="date">${new Date(notification.created_at).toLocaleDateString()}
                                    <i class="bx bx-trash alt  " onclick="deleteNotif(${notification.id})"></i>
                                    </span>
                                     
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
const notifPageContent = document.getElementById('notifPageContent');

if (notifPageContent) {
    console.log('success');

    fetchNotifPage();
} else {
    console.log('error');
}




function deleteNotif(id){
 
    axios.post('./db/php/user/deleteNotif-api.php', {
        notif_id: id // Replace 123 with the actual notification ID
    })
    .then(response => {
        if (response.data.status === 'success') {
            console.log(response.data.message);
            alert(response.data.message);
            window.location.reload();
            // Refresh or update the notifications list on the UI
        } else { 
            alert(response.data.message);
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Error deleting notification:', error);
    });
    

}