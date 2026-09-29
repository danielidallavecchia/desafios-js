
var valorAtual = ""; 
var $resposta = $("#resposta");
var ehResultado = false;

var operadores = ["%", "÷", "x", "-", "+"];

function limpaZeros() {
    if (valorAtual === "") valorAtual = "0";

    // remove zero a esquerda exceto antes de ponto decimal
    if (valorAtual.length > 1 && valorAtual[0] === "0" && valorAtual[1] !== ".") {
        valorAtual = valorAtual.slice(1);
    }
}

function ajustaFonte() {
    var tamanho = "80px"; // padrão
    
    if (valorAtual.length > 12) {
        tamanho = "40px";
    } else if (valorAtual.length > 8) {
        tamanho = "50px";
    }

    $resposta.css("font-size", tamanho);
}

function disparaAlerta(titulo, texto){
    Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        confirmButtonText: "Ok"
    });
}

function limitaTamanho() {
    if(!ehResultado && valorAtual.length > 15) {
        disparaAlerta("Valor inválido", "Máximo permitido são 15 caracteres");
    }
    if(valorAtual.length > 15) {
        valorAtual = valorAtual.slice(0,15);
    }
}

function ajustaPonto() {
    if(valorAtual===".") {
        valorAtual = "0.";
    }
}

function atualizar() {
    limpaZeros();
    ajustaFonte();
    limitaTamanho();
    ajustaPonto();

    $resposta.text(valorAtual);

    var $del = $("#ac");
    if(valorAtual!="0") {
        $del.text("C");
    } else {
        $del.text("AC");
    }
}

function limpar(tecla) {
    var resultado = valorAtual;

    if(valorAtual === "Infinity") {
        resultado = "0";
    } else if (tecla ==="AC") {
        resultado = "0";
    } else if(tecla === "C") {
        resultado = resultado.slice(0, -1); // remove ultimo elemento
    }
    return resultado;
}

function calcular() {
    var expressao = valorAtual.replace(/x/g, "*");
    expressao = expressao.replace(/÷/g, "/");
    expressao = expressao.replace(/[%÷x\-+]$/, "");

    var calculo = eval(expressao) || 0;

    // calculo = String(calculo);
    // // remove zeros a direita após o ponto decimal
    // if(ehResultado && calculo.includes(".")) {
    //     calculo = calculo.replace(/0+$/, ""); // tira zeros no final
    //     calculo = calculo.replace(/\.$/, ""); // tira o ponto se sobrar sozinho
    // }

    // padroniza decimal com 12 casas e no parse remove zeros a direita após o ponto
    return String(parseFloat(calculo.toPrecision(12))); 
}

function ehInicio() {
    return valorAtual === "" || valorAtual === "0";
}

function validaPrimeiraTecla(tecla) {
    var invalidoNoInicio = ["%", "÷", "x", "="];
    if (ehInicio() && invalidoNoInicio.includes(tecla)) {
        disparaAlerta("Operação inválida", "Digite um número antes de usar '" + tecla + "'");
        return false;
    }
    return true;
}

function executaCalculadora() {
    
    $(".tecla").click(function() {
        var tecla = $(this).text();

        if (!validaPrimeiraTecla(tecla)) {
            return;
        }

        if(tecla==="AC" || tecla==="C") {
            valorAtual = limpar(tecla);

        } else if(tecla==="=") {
            ehResultado = true;
            valorAtual = calcular();

        } else {
            if(ehResultado) {
                if(operadores.includes(tecla) || tecla===".") {
                    valorAtual = valorAtual + tecla; // concatena
                } else {
                    valorAtual = tecla; // sobrescreve
                }
                ehResultado = false;
            } else {
                var ultimo = valorAtual.slice(-1);

                if(operadores.includes(tecla) && operadores.includes(ultimo)) {
                    valorAtual = valorAtual.slice(0,-1) + tecla; // se for operador sobre operador, substitui
                } else {
                    valorAtual = valorAtual + tecla;
                }
            }
        }
       
        console.log("valorAtual:",valorAtual)
        console.log("ehResultado=",ehResultado)
        console.log("tecla:",tecla)

        atualizar();
    });
}

executaCalculadora();
