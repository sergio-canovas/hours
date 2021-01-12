//Observador
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        uid = user.uid;
    } else {
        window.location.replace("/index.html");
    }
}); 