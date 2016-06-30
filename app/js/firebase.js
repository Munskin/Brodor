var $chatWindow = $('.chat-window');
var $stagingWindow = $('.chat-staging');
var $sendButton = $('.send-button');
var $userInput = $('.user-input');
var $chatMessage = $('.chat-message');
var $loginButton = $('.login-button');
var $landingWrapper = $('.landing-wrapper');
var brodorFB = firebase.database().ref('/messages');
var provider = new firebase.auth.FacebookAuthProvider();
var facebookUser = null; /* filled by FB */


/**
  * Authorization
  =================
  * Sign in the user trough facebook
  */

$loginButton.on('click', function() {
    firebase.auth().signInWithRedirect(provider);
});

firebase.auth().getRedirectResult().then(function(result) {
    facebookUser = result.user.displayName;
    
    if (result.credential) {
        var token = result.credential.accessToken;
    }
    if (facebookUser != null) {
        $landingWrapper.velocity("fadeOut", 300);
        startChat();
    }
}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
});

/**
  * Sender
  =================
  * This sends messages to the database after triggers are fired
  */

$sendButton.on('click', function() {
    sendNewChat();
});

$userInput.on('keyup', function(e) {
    if (e.keyCode == 13) {
        sendNewChat();
    };
});

var sendNewChat = function() {
    var message = $userInput.val();

    if (message.length > 0) {
        brodorFB.push({
            username: facebookUser,
            message: message,
            timestamp: Date.now()
        });
        $userInput.val('');
    }
};


/**
  * Reciever
  =================
  * This listens for new messages and recieves them
  * Sends recieved messages to the HTML compiler
  */

var startChat = function() {
    brodorFB.limitToLast(20).on('child_added', function(messages) {
        var chatUser = messages.val().username
        var message = messages.val().message

        createChatElements(chatUser, message);
    });
    scrollSwitch();
}


/**
  * HTML compiler
  =================
  * This builds up the chat message HTML
  * Checks if the message is from the client user or not
  * Then appends the message to the staging element and calls the Distributor
  */

var createChatElements = function(chatUser, message) {
    var serverUser = chatUser.toLowerCase().replace(" ", "");
    var clientUser = facebookUser.toLowerCase().replace(" ", "");

    if (clientUser == serverUser) {
        var chatType = "user-message";
    } else {
        var chatType = "";
    }

    var chatHTML = '<div class="chat-message ' + chatType + '">';
    chatHTML += '<h5 class="chat-message-username">' + chatUser + '</h5>';
    chatHTML += '<p class="chat-message-message">' + message + '</p>';
    chatHTML += '</div>';

    $stagingWindow.append(chatHTML);
    
    distributeChats();
};


/**
  * Distributor
  =================
  * This loops trough all chats in staging and sends the first available to the Animator
  * If there are more chats, it will send them delayed - 20ms.
  */

var distributeChats = function() {
    var timer = 0;
    
    for (var i = 0; i < $stagingWindow.children().length; i++) {
        setTimeout(function(){
            var firstChat = $stagingWindow.children().first();
            animateToChatWindow(firstChat);
        }, timer);
        timer += 20;    
    }
}

/**
  * Animator
  =================
  * Appends the recieved chat to the chat window
  * Scrolls to the appended element
  * Removes the invisible state which triggers CSS animation
  */
  
var animateToChatWindow = function(element) {
    element.addClass('invisible-state');
    element.appendTo($chatWindow);
  
    element.velocity("scroll", { 
        container: $chatWindow,
        duration: 400,
        easing: "easeOutCubic",
        offset: -currentChatOffset()
    });
    
    setTimeout(function(){
      element.removeClass('invisible-state');
    }, 0);
}

/**
  * Get last chat elements offset to top
  =======================================
  * Return height of last element subtracted from chat window.
  */

var currentChatOffset = function() {
    var lastChatHeight = $chatWindow.children().last().outerHeight() + 10;
    var chatWindowHeight = $chatWindow.outerHeight();
    return chatWindowHeight - lastChatHeight;
}

/**
  * Scroll switch
  =================
  * Checks if the user has scrolled up
  * returns true/false
  */
  
var scrollSwitch = function() {    
    $chatWindow.scroll(function(){
         if ($chatWindow.children().last().offset().top > currentChatOffset() + $chatWindow.children().last().outerHeight()) {
            console.log('user scrolled up');
         } else {
            console.log('user is up to date');
         }
    });
}