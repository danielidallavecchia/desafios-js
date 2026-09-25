
var gasolinaAtual = 100;

var intensidade = 1;
var gasto = 2;

var velocidade = 1;

var $carro = $("#carro");
var pixels = 10;

var quebrado = false;

window.addEventListener('keydown', (event) => {
    if(quebrado) return;

    var topo = parseInt($carro.css("top")) || 0;
    var left = parseInt($carro.css("left")) || 0;
    var rotacao = "0";
    var virar = "1";

    var $pagina = $(".pagina");
    var limiteMaximoX = $pagina.width() - $carro.outerWidth();
    var limiteMaximoY = $pagina.height() - $carro.outerHeight();

    batida(left, topo, limiteMaximoX, limiteMaximoY);

    switch(event.key) {
        case "ArrowUp":
            topo -= pixels*velocidade;
            rotacao = "270deg";
            atualizarGasolina();
            break;
        case "ArrowDown":
            topo += pixels*velocidade;
            rotacao = "90deg";
            atualizarGasolina();
            break;
        case "ArrowLeft":
            left -= pixels*velocidade;
            rotacao = "0deg";
            virar = "scaleX(-1)";
            atualizarGasolina();
            break;
        case "ArrowRight":
            left += pixels*velocidade;
            rotacao = "0deg";
            virar = "scaleX(1)";
            atualizarGasolina();
            break;
    }   

    var leftFinal = Math.max(0, Math.min(left, limiteMaximoX));
    var topoFinal = Math.max(0, Math.min(topo, limiteMaximoY));

    $carro.css("left", leftFinal + "px");
    $carro.css("top", topoFinal + "px");
    $carro.css("rotate", rotacao);
    $carro.css("transform", virar);

    event.preventDefault();
});

var modoTurbo = false;

document.getElementById("botao-turbo").addEventListener("click", function(event) {
    var $texto = $("#texto-turbo");
    
    modoTurbo = !modoTurbo;

    if(modoTurbo) {
        $texto.show();
        $("#botao-turbo").addClass("botao-turbo-on");
        intensidade = 5;
        velocidade = 8;
    } else {
        $texto.hide();
        $("#botao-turbo").removeClass("botao-turbo-on");
        intensidade = 1;
        velocidade = 1;
    }
});

function resetaPagina() {
    $carro = $("#carro");
    $carro.attr("src", "../img/landau_direita.jpg");
    gasolinaAtual = 100;
    intensidade = 1;
    velocidade = 1;
    window.location.reload();
}

var gasolinaMax = 100;

function atualizarGasolina() {
    if(gasolinaAtual > 100) gasolinaAtual = 100;

    gasolinaAtual -= gasto*intensidade;

    if(gasolinaAtual > gasolinaMax) {
        gasolinaAtual = gasolinaMax;
    }

    var nova = (gasolinaAtual / gasolinaMax) * 100;

    if(nova === 0 && !quebrado) {
        Swal.fire({
            title: "Gasolina acabou",
            text: "Vá abastecer com urgência!",
            icon: "info",
            customClass: {
                popup: "alerta-gasolina"
            },
            confirmButtonText: "Ok, abasteça agora"
        }).then((result) => {
            resetaPagina();
        });
    }

    $("#barra").css("width", nova + "%");
}

document.getElementById("botao-abastecer").addEventListener("click", function(event) {
    if(quebrado) return;

    if(gasolinaAtual == 100) {
        Swal.fire({
            title: "Gasolina cheia",
            text: "Seu tanque já está cheio!",
            icon: "success",
            customClass: {
                popup: "alerta-ok"
            },
            confirmButtonText: "Ok"
        });
    } else {
        gasolinaAtual = 130;
        $("#barra").css("width", "100%");
    }    
});

function batida(posicaoX, posicaoY, limiteMaximoX, limiteMaximoY) {
    var batida = false;

    if ((posicaoX <= 0) || (posicaoX >= limiteMaximoX) || (posicaoY <= 0) || (posicaoY >= limiteMaximoY)) {
        batida = true;
    }

    if (batida) {
        quebrado = true;
        $carro = $("#carro");
        $carro.attr("src", "../img/landau_batido.png");

        Swal.fire({
            title: "Acidente",
            text: "Você bateu na borda!",
            icon: "error",
            customClass: {
                popup: "alerta-batida"
            },
            confirmButtonText: "Ok"
        });
    }
}

document.getElementById("botao-consertar").addEventListener("click", function(event) {
    if(quebrado) {
        resetaPagina();
    } else {
        Swal.fire({
            title: "Nada a consertar",
            text: "Seu carro está em ótimo estado!",
            icon: "success",
            customClass: {
                popup: "alerta-ok"
            },
            confirmButtonText: "Ok"
        });
    }
});
