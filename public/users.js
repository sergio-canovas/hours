
const login_w = document.querySelector("#login");
const registro_w = document.querySelector("#registro");
const forzar_login = document.querySelector("#forzar_login")
const modal = document.getElementById("myModal");
var abrir_r = document.querySelector("#abrir_registro");
var abrir_l = document.querySelector("#abrir_login");

//Definición de función para cambiar de div
function cambiar_ventana(abrir, cerrar)
{
    cerrar.style.display="none";
    abrir.style.display="inline-block";
    document.querySelector("#error_l").innerHTML ="";
}



//Registro
function primer_login()
{
    setTimeout(
        ()=>firebase.auth().signInWithEmailAndPassword(user,key)
        ,5000);
};

var usuario_r = document.querySelector("#usuario_r");
var clave_r = document.querySelector("#clave_r");
var dni_r = document.querySelector("#dni_r");
var confirmit_r = document.querySelector("#confirmit_r");
var in_reg = document.querySelector("#in_reg");
var form_registro = document.querySelector("#form_registro");
var valido=false;

in_reg.addEventListener("click",function(e){ 
    e.preventDefault();

    for (var i=0;i<form_registro.length;i++)
    {
        if (form_registro[i].value=="") {                 
            valido = false;
            document.querySelector("#error_l").innerHTML ="<h3>Por favor, rellena todos los campos</h3>";
            
            break; 
        }
        else {valido = true;}
    }
    if (valido)
    {
        let user = usuario_r.value;
        let key = clave_r.value;
        let dni = dni_r.value;
        let confirmit = confirmit_r.value;
        modal.style.display = "block";
      
        const welcome = firebase.functions().httpsCallable("welcome");
        welcome({ dni: dni, confirmit:confirmit,user:user,key: key})
        .then(() => 
        {           
            setTimeout(
                ()=>firebase.auth().signInWithEmailAndPassword(user,key)
                ,5000);
        })
        .catch(function(error) 
        {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Ooops "  + errorMessage);
            primer_login();
        })
    };       
});

//Force login

forzar_login.addEventListener("click", function(){
    let user = usuario_r.value;
    let key = clave_r.value;
    
    firebase.auth().signInWithEmailAndPassword(user, key)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Ooops "  + errorMessage);
            document.querySelector("#error_l").innerHTML ="<span>Algo salió mal, vuelve a intentarlo o contacta con un administrador...</span>";
            // ...
      });
    }); 

//Login

var usuario_l = document.querySelector("#usuario_l");
var clave_l = document.querySelector("#clave_l");
let form_l = document.querySelector("#login_f")
var in_log = document.querySelector("#in_log");
let valido2 = false;
in_log.addEventListener("click",function(e){
    let user = usuario_l.value;
    let key = clave_l.value;
    e.preventDefault();
    for (var i = 0;i<form_l.length;i++)
    {
        if (form_l[i].value == "")
        {
            valido2 = false;
            document.querySelector("#error_l").innerHTML ="<h3>Por favor, rellena todos los campos</h3>";          

            break;
        } else {valido2 = true;}
        
    }
    if (valido2)
    {
        
        firebase.auth().signInWithEmailAndPassword(user, key)
        .then(()=>{
            if (user) {
                window.location.replace("/main.html");
            }
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Ooops "  + errorMessage);
            document.querySelector("#error_l").innerHTML ="<h3>Algo salió mal. Si has olvidado tu contraseña pulsa aquí.</h3>";          

        });
    }
    
})

//Redirects

    //Si autenticado...

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.replace("/main.html");
    }
  });

    //Si no account...

abrir_r.addEventListener("click",()=>cambiar_ventana(registro_w,login_w));

    //Si account...

abrir_l.addEventListener("click",()=>cambiar_ventana(login_w, registro_w));
