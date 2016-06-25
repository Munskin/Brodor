$(function() {
    var myFirebase = firebase.database().ref();
    var textInput = document.querySelector('.user-input');
    var sendButton = document.querySelector('.send-button');

    var sendMessage = function() {
        var msgText = textInput.value;
        myFirebase.push({
            message: msgText,
            username: "Sam"
        });
        textInput.value = "";
    }

    sendButton.addEventListener("click", function() {
           sendMessage();
    });

    textInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            sendMessage();
        }
    });

    /** Function to add a data listener **/
    var startListening = function() {
        myFirebase.on('child_added', function(snapshot) {
            var msg = snapshot.val();

            var message = msg.message;
            var user = msg.username;

            // populate function with data
            createChatElements(user, message);

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
    }

    // Begin listening for data
    startListening();
});
