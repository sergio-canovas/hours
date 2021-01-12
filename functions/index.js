const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();


exports.welcome = functions.https.onCall((data,context) =>{
    console.log("Iniciando registro")
    const dni = data.dni;
    const confirmit = data.confirmit;
    const user = data.user;
    const key = data.key;
    console.log(user)
    admin.auth().createUser({
        email: user,
        emailVerified: false,
        password: key,        
        disabled: false

      })
    .then(function() 
    {
        return admin.auth().getUserByEmail(user)
        .then(function(userRecord) {
            console.log(userRecord.uid);
            console.log("Creando usuario")        
            const ruta_users = "usuarios/" + userRecord.uid;
            const db_users = admin.database().ref(ruta_users);
            db_users.set({
                dni: dni,
                confirmit: confirmit
            });
        });
        
    })
    .catch(function(error) 
        {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Ooops "  + errorMessage);
        });
});