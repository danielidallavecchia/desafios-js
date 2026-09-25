
var modoTurbo = false;

document.getElementById("botao-turbo").addEventListener("click", function(event) {
    var $texto = $("#texto-turbo");
    
    modoTurbo = !modoTurbo;

    if(modoTurbo) {
        $texto.show();
        $("#botao-turbo").addClass("botao-turbo-on");
    } else {
        $texto.hide();
        $("#botao-turbo").removeClass("botao-turbo-on");
    }
});

var $carro = $("#carro");
var $estrada = $(".estrada");
var pixels = 15;

window.addEventListener('keydown', (event) => {
    var topo = parseInt($carro.css("top")) || 0;
    var left = parseInt($carro.css("left")) || 0;
    var rotacao = "0";
    var virar = "1";

    var larguraEstrada = $estrada.width();
    var alturaEstrada = $estrada.height();
    var larguraCarro = $carro.outerWidth();
    var alturaCarro = $carro.outerHeight();

    switch(event.key) {
        case "ArrowUp":
            if (topo - pixels >= 0) {
                topo -= pixels;
            } else {
                topo = 0; // Trava no topo
            }
            rotacao = "270";
            break;
        case "ArrowDown":
            if (topo + alturaCarro + pixels <= alturaEstrada) {
                topo += pixels;
            } else {
                topo = alturaEstrada - alturaCarro; // Trava no fundo
            }
            rotacao = "90";
            break;
        case "ArrowLeft":
            if (left - pixels >= 0) {
                left -= pixels;
            } else {
                left = 0; // Trava na esquerda
            }
            rotacao = "180";
            virar = "scaleX(-1)";
            break;
        case "ArrowRight":
            if (left + larguraCarro + pixels <= larguraEstrada) {
                left += pixels;
            } else {
                left = larguraEstrada - larguraCarro; // Trava na direita
            }
            rotacao = "0";
            virar = "scaleX(1)";
            break;
    }   

    $carro.css("left", left + "px");
    $carro.css("top", topo + "px");
    $carro.css("rotate", rotacao + "deg");

    event.preventDefault();
});

