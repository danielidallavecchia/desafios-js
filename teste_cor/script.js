
const cores = ["black", "red", "blue", "yellow", "purple"];
var atual = 0;

document.getElementById("botao-restaurar").addEventListener("click", function(event) {
    var $corpo = $("#corpo");
    $corpo.css("background-color", cores[0]);
    atual = 0;
});

document.getElementById("botao").addEventListener("click", function(event) {
    mudarCor();
});

function mudarCor() {
    var $corpo = $("#corpo");

    var max = cores.length - 1;

    if(atual===max) {
        atual = -1;
    } 

    var cor = cores[atual + 1];
    atual++;

    $corpo.css("background-color", cor);
};
