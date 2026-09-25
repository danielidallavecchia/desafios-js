
document.getElementById("chave").addEventListener("click", function(event) {
    var cadeado = document.getElementById("cadeado"); 

    if(event.target.id == "chave") {
        cadeado.src = "../img/cadeado_aberto.png";
    } 
});

document.getElementById("cadeado").addEventListener("click", function(event) {
    cadeado.src = "../img/cadeado_fechado.png";
});
