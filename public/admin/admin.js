let calendario = document.querySelector("#calendario"); //calendario
let listado = document.querySelector("#listado"); //tabla
let ver_listado = document.querySelector("#ver_listado"); //botón listar
let b_exportar = document.querySelector("#exportar"); //botón descargar

//R
while(uid = undefined)
{
    console.log("Sin datos")
}
setTimeout(()=>
{
    let check = db_portal.ref("/usuarios/"+uid);
console.log(uid);
check.once("value")
    .then(function(u_snap){
        let existe = u_snap.child("/admin").exists();
        if (!existe){
            console.log ("no existe");
            window.location.replace("../main.html")
        }
    });

},1500)


//Valores calendario
calendario.value = moment().format("YYYY-MM-DD");
calendario.max = moment().format("YYYY-MM-DD");  

//Consultas
ver_listado.addEventListener("click",()=>{
    //Resetea tabla
    listado.innerHTML ="<tr><th>Usuario</th><th>Inicio jornada</th><th>Fin jornada</th><th>Inicio descanso</th><th>Fin descanso</th><th>Estudio</th><th>Código</th><th>Dni</th><th>Entrevistas</th><th>Horas empleadas</th></tr>"; 
    b_exportar.disabled = false;
    dia = document.querySelector("#calendario").value; //Toma valor del calendario
    let horas_db = db_portal.ref("horas/"+dia); //Ruta horas/día
     
    horas_db.once("value")
    .then(function(dia_user){
        dia_user.forEach(function(dia_user_hijo){ //Por cada usuario ->
           
           let user_id = dia_user_hijo.key; //Toma uid
           let users_db = db_portal.ref("usuarios/"+user_id); //Ruta /usuario/uid                       
           let confirmit;
           let dni;

            //Usuario info(dni, confirmit user)
            users_db.once("value")
            .then(function(u_snap){
                let user_info = u_snap.val();
                confirmit = user_info.confirmit;
                dni = user_info.dni;
            });

           let estudios_db = db_portal.ref("horas/"+dia+"/"+user_id); //Ruta /horas/dia/usuario
           estudios_db.once("value")
           .then(function(user_estudio){ 
               let info_jornada = user_estudio.val();
               let j_inicio=info_jornada.inicio_jornada;
               let j_fin = info_jornada.fin_jornada;
               let d_inicio = info_jornada.inicio_descanso;
               let d_final = info_jornada.fin_descanso;
               console.log(j_inicio);
               user_estudio.forEach(function(user_estudio_hijo){ //Por cada estudio ->
                    let estudio = user_estudio_hijo.key;
                    let codigos_db = db_portal.ref("horas/"+dia+"/"+user_id+"/"+estudio)//Ruta /horas/dia/usuario/estduio

                    codigos_db.once("value")
                    .then(function(user_codigos){
                        user_codigos.forEach(function(user_codigos_hijo){ //Por cada codigo
                            let codigo = user_codigos_hijo.key;
                            let user_data = user_codigos_hijo.val();
                            console.log(user_data);
                            let h_entrada = user_data.h_entrada;
                            let entrevistas = user_data.entrevistas;
                            
                            //Relleno de tabla
                            listado.innerHTML += 
                            "<tr><td>"+confirmit+"</td><td>"+j_inicio+"</td><td>"+j_fin+"</td><td>"+d_inicio+"</td><td>"+d_inicio+"</td><td>"+estudio+"</td><td>"+codigo+"</td><td>"+dni+"</td><td>"+entrevistas+"</td><td>"+h_entrada+"</td></tr>";
               
                        });
                    });                            
                });
           })                                 
       });
    });
});

//Descargar listado

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }
    filename = "horas_"+calendario.value+".csv";
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}