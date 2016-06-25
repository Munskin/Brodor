$(function() {
    
    var newUser = "Wessel"
    
    var chatWindow = document.getElementsByClassName('chat-window')[0];
    var sendButton = document.getElementsByClassName('send-button')[0];
    var userInput = document.getElementsByClassName('user-input')[0];
    var chatMessage = document.getElementsByClassName('chat-message');
    
    // get messages from database
    firebase.database().ref('/messages').on('value', function(messages) {
        
        chatWindow.innerHTML = '';
        
        // traverse messages function
        function traverse(obj) {
            for (var prop in obj) {
                var message = obj[prop].message;
                var user = obj[prop].username;
    
                // populate function with data
                createChatElements(user, message);
            };
        };
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
        appendCurrentElements(chatHTML);
    };

    // append chatHTML to chat-window
    function appendCurrentElements(chat) {
        chatWindow.innerHTML += chat;
    };
    
    // new chat message triggers
    sendButton.addEventListener('click', function(){
        appendNewChatElement();
    });
    
    userInput.addEventListener('keyup', function(e){
       if (e.keyCode == 13) { appendNewChatElement(); }; 
    });
    
    // append new chat elements with data
    function appendNewChatElement() {
        var chatCount = chatMessage.length + 1;
        var message = userInput.value;
        firebase.database().ref('/messages/' + Date.now()).set({
            username: newUser,
            message: message
        });
        userInput.value = '';
    };
});
