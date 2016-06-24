$(function() {
    // get messages from database
    firebase.database().ref('/').on('value', function(messages) {
        
        // traverse messages function
        function traverse(obj) {
            for (var prop in obj) {
                var message = obj[prop].message;
                var user = obj[prop].username;
                
                // populate function with data
                createChatElements(user, message);
            }
        }
        // call function
        traverse(messages.val());
    });

    // build html for chat elements
    function createChatElements(user, message) {
        var chatHTML = '<div class="chat-message">';
        chatHTML += '<h5 class="chat-message-username">' + user + '</h5>';
        chatHTML += '<p class="chat-message-message">' + message + '</p>';
        chatHTML += '</div>';

        // function to append chat
        appendChatElements(chatHTML);
    }

    // append chatHTML to chat-wrapper
    function appendChatElements(chat) {
        $('.chat-window').append(chat);
    }
});
