
var gasolinaAtual = 100;

var intensidade = 1;
var gasto = 1;

var velocidade = 1;

var $carro = $("#carro");
var $pag = $("#corpo");

// centraliza o carro no meio da tela
var inicioX = ($pag.width() - $carro.width()) / 2;
var inicioY = ($pag.height() - $carro.height()) / 2;

$carro.css("left", inicioX + "px");
$carro.css("top", inicioY + "px");

// qtd de px para avançar
var pixels = 10;

// estado do carro
var quebrado = false;

// variáveis usadas na rotação do carro
var rotacao = 0; // em graus
var direcao = "direita"; // ultima direção
var espelho = 1; // 1 (mantém) ou -1 (inverte) no scaleX do css

// Processa cada tecla pressionada
window.addEventListener('keydown', (event) => {
    if(quebrado) {;
        return
    };

    var topoAtual = parseInt($carro.css("top")) || 0;
    var leftAtual = parseInt($carro.css("left")) || 0;

    var leftProximo=leftAtual;
    var topoProximo=topoAtual;

    if (event.key === "ArrowUp") {
        topoProximo -= pixels * velocidade;

        if (direcao === "direita") {
            rotacao -= 90;
        } else if (direcao === "cima") {
            // mantém
        } else if (direcao === "esquerda") {
            rotacao += 90;
        } else if (direcao === "baixo") {
            rotacao -= 0;
            if (espelho === 1) {
                espelho = -1;
            } else {
                espelho = 1;
            }
        }

        direcao = "cima";
        atualizarGasolina();

    } else if (event.key === "ArrowDown") {
        topoProximo += pixels * velocidade;

        if (direcao === "direita") {
            rotacao += 90;
        } else if (direcao === "cima") {
            rotacao += 0;
            if (espelho === 1) {
                espelho = -1;
            } else {
                espelho = 1;
            }
        } else if (direcao === "esquerda") {
            rotacao -= 90;
        } else if (direcao === "baixo") {
            // mantém
        }

        direcao = "baixo";
        atualizarGasolina();

    } else if (event.key === "ArrowLeft") {
        leftProximo -= pixels * velocidade;

        if (direcao === "direita") {
            rotacao += 0;
            if(espelho === 1) {
                espelho = -1;
            } else {
                espelho = 1;
            }
        } else if (direcao === "cima") {
            rotacao -= 90;
        } else if (direcao === "esquerda") {
            // mantém
        } else if (direcao === "baixo") {
            rotacao += 90;
        }

        direcao = "esquerda";
        atualizarGasolina();

    } else if (event.key === "ArrowRight") {
        leftProximo += pixels * velocidade;

        if (direcao === "direita") {
            // mantém
        } else if (direcao === "cima") {
            rotacao += 90;
        } else if (direcao === "esquerda") {
            rotacao += 0;
            if(espelho === -1) {
                espelho = 1;
            } else {
                espelho = -1;
            }
        } else if (direcao === "baixo") {
            rotacao -= 90;
        }

        direcao = "direita";
        atualizarGasolina();

    } 

    var $pagina = $("#corpo");

    var larguraCarro = $carro.outerWidth();
    var alturaCarro = $carro.outerHeight();

    if (rotacao===90 || rotacao===-90) {
        var temp = larguraCarro;
        larguraCarro = alturaCarro;
        alturaCarro = temp;
    }

    var ajusteX = (larguraCarro - $carro.width()) / 2;
    var ajusteY = (alturaCarro - $carro.height()) / 2;

    var limiteMinimoX = ajusteX;
    var limiteMaximoX = $pagina.width() - $carro.width() - ajusteX;
    var limiteMinimoY = ajusteY;
    var limiteMaximoY = $pagina.height() - $carro.height() - ajusteY;

    if (leftProximo < limiteMinimoX) {
        leftProximo = limiteMinimoX;
    } else if (leftProximo > limiteMaximoX) {
        leftProximo = limiteMaximoX;
    }
    
    if (topoProximo < limiteMinimoY) {
        topoProximo = limiteMinimoY;
    } else if (topoProximo > limiteMaximoY) {
        topoProximo = limiteMaximoY;
    }

    if (leftProximo===limiteMinimoX || leftProximo===limiteMaximoX 
        || topoProximo===limiteMinimoY || topoProximo===limiteMaximoY) {
        $carro.css("left", leftProximo + "px");
        $carro.css("top", topoProximo + "px");
        $carro.css("rotate", rotacao);

        batida();
        return;
    }

    $carro.css("left", leftProximo + "px");
    $carro.css("top", topoProximo + "px");
    $carro.css("transform", "rotate(" + rotacao + "deg) scaleX(" + espelho + ")");

});

// Processa modo turbo (aumenta velocidade mas gasta mais gasolina)
var modoTurbo = false;

document.getElementById("botao-turbo").addEventListener("click", function(event) {
    var $texto = $("#texto-turbo");
    
    modoTurbo = !modoTurbo;

    if(modoTurbo) {
        $texto.show();
        $("#botao-turbo").addClass("botao-turbo-on");
        intensidade = 5;
        velocidade = 5;
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

// Atualiza a gasolina do carro
function atualizarGasolina() {
    if(gasolinaAtual > 100) gasolinaAtual = 100;

    gasolinaAtual -= gasto*intensidade;

    if(gasolinaAtual > gasolinaMax) {
        gasolinaAtual = gasolinaMax;
    }

    var nova = (gasolinaAtual / gasolinaMax) * 100;
    $("#barra").css("width", nova + "%");

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
}

// Processa o "abastecimento" (enche a gasolina mantendo a posição)
document.getElementById("botao-abastecer").addEventListener("click", function(event) {
    if(quebrado) return;

    if(gasolinaAtual === 100) {
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
        gasolinaAtual = 100;
        $("#barra").css("width", "100%");
    }    
});

// Processa a batida do carro na borda
function batida() {
    quebrado = true;
    $carro = $("#carro");
    $carro.attr("src", "../img/landau_batido.png");

    setTimeout(() => {
        Swal.fire({
            title: "Acidente",
            text: "Você bateu na borda!",
            icon: "error",
            customClass: {
                popup: "alerta-batida"
            },
            confirmButtonText: "Ok"
        }).then((result) => {
            resetaPagina();
        });
    }, 500);
}

// Botão reiniciar recarrega a página
document.getElementById("botao-reiniciar").addEventListener("click", function(event) {
    resetaPagina();
});
