
var lampada = document.getElementById("lampada");

var apagada = true;

document.onclick = function() {
    if(apagada) {
        lampada.src = "../img/lampada_acesa.png";
        apagada = false;
    } else {
        lampada.src = "../img/lampada_apagada.png";
        apagada = true;
    }
};
