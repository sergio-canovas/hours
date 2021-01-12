//Grabar horas
let valido = false; //Validación de formulario
let modo_farma = false; //Valida si las tareas son de farma
let modo_entrevistas = document.querySelector("#entrevistas")//Valida si es necesario introducir entrevistas
let d_sumatorio = 0 //Sumatorio de jornada
let h_sumatorio = 0; //Sumatorio de horas
let muestra_fecha = document.querySelector("#mostrar_fecha"); //Mostrar fecha
let form_horas = document.querySelector("#form_horas"); //formulario horas
let form_fichaje = document.querySelector("#form_fichaje");//formulario jornada
let fecha_actual=moment().format("YYYY-MM-DD");
let save_jornada = document.querySelector("#h_jornada"); //botón enviar jornada   
let save = document.querySelector("#in_hour"); //botón enviar horas

//Función para habilitar o deshabilitar campos de formulario.

function codigos(){
//Códigos para farma
    let codigo = document.querySelector("#codigo").value
    let codigo_f = document.querySelector("#codigo_f").value
    if (codigo == "10")
    {
        document.querySelector("#codigo_f").disabled = false;
        modo_farma = true;
    }
    else{ 
        document.querySelector("#codigo_f").disabled = true;
        modo_farma = false; 
    }
//Códigos para entrevista
    let validos = [
        "(1)Cati - Entrevista telefónica",
        "(5)Escuchas/auditorías",
        "(8)Recuperación",
        "(9)Captación",
        "10",
        "(1farma)Entrevista telefónica",
        "(2farma)Coincidentes - Recuerdos_llamadas",
        "(3farma)Coincidentes - Preparar listados",
        "(4farma)No coincidentes - Captación",
        "(5farma)No coincidentes - Recuerdos_llamada",
        "(6farma)No coincidentes - Preparar listados",
        "(9farma)Piloto - Validaciones",
        "(10farma)Transcripciones, grabaciones"
    ];
    for (var i = 0; i<validos.length;i++)
    {
        if (codigo == validos[i] && !modo_farma || modo_farma && codigo_f == validos[i])
        {
            modo_entrevistas.disabled = false;
            modo_entrevistas.value = "";
            break;
        }
        else{
            modo_entrevistas.value = 0;
            modo_entrevistas.disabled = true;
        }
    }

}


//Muestra la fecha
let fecha_mod= moment().format("DD-MM-YYYY")
muestra_fecha.innerHTML= fecha_mod;

//Salvar jornada.
save_jornada.addEventListener("click",function(){
    for (var i=0;i<form_fichaje.length;i++)
    {
        if (form_fichaje[i].value=="") {                 
            valido = false;
            break; 
        }
        else {valido = true;}

    }
    if (valido)
    {        
        let ruta_jornada = "horas/"+ fecha_actual+ "/"+ uid; //ruta
        let db_jornada = db_portal.ref(ruta_jornada);
        let h_jornada_i  = document.querySelector("#h_jornada_i").value; //nombre de estudio       
        let h_jornada_f  = document.querySelector("#h_jornada_f").value //código
        let h_descanso_i  = document.querySelector("#h_descanso_i").value //código
        let h_descanso_f  = document.querySelector("#h_descanso_f").value //código
     

        // Graba datos
        db_jornada.set({
            inicio_jornada: h_jornada_i,
            fin_jornada: h_jornada_f,
            inicio_descanso: h_descanso_i,
            fin_descanso:h_descanso_f
        }).then(function() {
            console.log("Hecho!");
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }  
})

//Salvar horas estudios.
save.addEventListener("click",function(){
    //Valida formulario
    for (var i=0;i<form_horas.length;i++)
    {
        if (form_horas[i].value=="") {                 
            valido = false;
            break; 
        }
        else {valido = true;}

    }
    if (valido)
    {
        let estudio = document.querySelector("#estudio").value; //nombre de estudio               
        let codigo = document.querySelector("#codigo").value //código
        if (modo_farma){
            codigo = document.querySelector("#codigo_f").value
        }
        let ruta_horas = "horas/"+ fecha_actual+ "/"+ uid + "/" + estudio +"/" + codigo; //ruta
        let db_horas = db_portal.ref(ruta_horas);
        let entrevistas = document.querySelector("#entrevistas").value;
        let h_entrada = document.querySelector("#h_entrada").value;
        

        // Graba datos
        db_horas.set({
            entrevistas: entrevistas,
            h_entrada: h_entrada,
        }).then(function() {
            console.log("Hecho!");
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }    
})

//Cerrar sesión

var cerrar = document.querySelector("#cerrar_sesion")
cerrar.addEventListener("click",()=>
    firebase.auth().signOut().then(function() {
        console.log("Has cerrado sesión");
    })
    .catch(function(error) {
    // An error happened.
    })
);

//Mostrar página 

firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.querySelector("#bienvenido").style.display="block";
            document.querySelector("#loading").style.display="none";
        }
})

//Mostrar tabla

setTimeout(()=>{
    let estudios_db = db_portal.ref("horas/"+ fecha_actual+ "/"+ uid); //Ruta /horas/dia/usuario
       estudios_db.once("value")
       .then(function(user_estudio){ 
           let info_jornada = user_estudio.val();
           let existe = user_estudio.child("inicio_jornada").exists();
           let existe2 = user_estudio.numChildren()>4;
            console.log(existe2);
            if (!existe2)
            {
                document.querySelector("#fichaje").style.display="inline-block";
                document.querySelector("#formulario_main").style.display="none";
                document.querySelector("#t_historico").innerHTML += 
                "<tr><td colspan='5'>Sin datos de hoy</td></tr>";
            
            };

           if (existe){
            document.querySelector("#fichaje").style.display="none";
            document.querySelector("#formulario_main").style.display="inline-block";
            let j_entrada = info_jornada.inicio_jornada;
            let j_fin = info_jornada.fin_jornada;
            let d_inicio = info_jornada.inicio_descanso;
            let d_fin = info_jornada.fin_descanso;
            let a = moment.duration(j_entrada).asMinutes();
            console.log(a);
            let b = moment.duration(j_fin).asMinutes();
            console.log(b);
            d_sumatorio = b - a;
            console.log(d_sumatorio);
                //Imprimir tabla
            document.querySelector("#t_jornada").innerHTML += "<tr><td>"+j_entrada+"</td><td>"+j_fin+"</td><td>"+d_inicio+"</td><td>"+d_fin+"</td></tr>";

           } else{
            document.querySelector("#t_jornada").innerHTML += "<tr><td colspan='4'>Sin datos de hoy</td></tr>"
           }
          
           //Sigue consulta -->           

           user_estudio.forEach(function(user_estudio_hijo){ //Por cada estudio ->
                let estudio = user_estudio_hijo.key;
                let codigos_db = db_portal.ref("horas/"+fecha_actual+"/"+uid+"/"+estudio)//Ruta /horas/dia/usuario/estudio                            
                
                codigos_db.once("value")
                .then(function(user_codigos){                    
                    user_codigos.forEach(function(user_codigos_hijo){ //Por cada codigo
                        let codigo = user_codigos_hijo.key;
                        let user_data = user_codigos_hijo.val();
                        console.log(user_data);
                        let h_entrada = user_data.h_entrada;
                        let entrevistas = user_data.entrevistas;
                        h_sumatorio += moment.duration(h_entrada).asMinutes(); //Suma las horas.
                        console.log(h_sumatorio);
                        if (h_sumatorio > d_sumatorio)
                        {
                            alert("Por favor, revisa las horas. Has añadido más horas a proyectos que lo que ha durado la jornada.")
                        }
                        //Relleno de tabla
                        if (existe2)
                        {
                            document.querySelector("#t_historico").innerHTML += 
                            "<tr><td>"+estudio+"</td><td>"+codigo+"</td><td>"+entrevistas+"</td><td>"+h_entrada+"</td></tr>";
                        }
                    });
                });                            
            });
       });
}, 3000);

//Borrar horas

borrar = document.querySelector("#borrar_horas")
borrar.addEventListener("click",()=>{
    let estudios_db = db_portal.ref("horas/"+ fecha_actual + "/"+ uid);
    estudios_db.remove();
    location.reload();
})