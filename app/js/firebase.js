$(function() {
    var myFirebase = firebase.database().ref('/messages');
    var textInput = document.querySelector('.user-input');
    var sendButton = document.querySelector('.send-button');

    function toggleSignIn() {
        if (!firebase.auth().currentUser) {
            // [START createprovider]
            var provider = new firebase.auth.FacebookAuthProvider();
            // [END createprovider]
            provider.addScope('public_profile');
             // [START signin]
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
            });
            // [END signin]
        } else {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
        }
    };

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            username = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
        } else {
            // User is signed out.
        }
    });

    function sendMessage() {
        var msgText = textInput.value;
        myFirebase.push({
            message: msgText,
            username: username
        });
        textInput.value = "";
    };

    sendButton.addEventListener("click", function() {
        toggleSignIn();
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
