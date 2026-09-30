// Métodos úteis: includes, replace, split

var valorAtual = ""; 
var $resposta = $("#resposta");
var ehResultado = false;
var temErro = false; // true enquanto houver mensagem no #msg-erro

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

function mostraErro(texto) {
    temErro = true;
    var $msgErro = $("#msg-erro");
    $msgErro.css("display", "block");
    $msgErro.text(texto);
}

function limpaErro() {
    temErro = false;
    var $msgErro = $("#msg-erro");
    $msgErro.css("display", "none");
    $msgErro.text("Expressão mal formatada");
}

function limitaTamanho() {
    if(!ehResultado && valorAtual.length > 15) {
        mostraErro("Máximo permitido são 15 caracteres");
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

    $resposta.text(valorAtual.replace(/\./g, ","));

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
        if(ehResultado) {
            resultado = "0";
        } else {
            resultado = resultado.slice(0, -1); // remove ultimo elemento
        }
    }

    if(temErro) {
        resultado = "0";
    }

    limpaErro();

    return resultado;
}

function validaUltimoDigito(expressao) {
    if(valorAtual==="" || valorAtual==="0") {
        return true;
    }

    var ultimo = expressao.slice(-1);
    var invalidoNoFim = [".", "÷", "x", "-", "+"];

    if (invalidoNoFim.includes(ultimo)) {
        mostraErro("Expressão mal formatada");
        return false;
    }
    return true;
}

function formataOperadores(expressao) {
    expressao = valorAtual.replace(/x/g, "*");
    expressao = expressao.replace(/÷/g, "/");
    return expressao;
}

function calculaPorcento(expressao) {
    if(!expressao.includes("%")) {
        return expressao;
    }

    // algum valor +- n%
    expressao = expressao.replace(
        /(\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)%/g,
        "$1$2($1*$3/100)"
    );

    // somente n%
    return expressao.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
}

function calcular() {
    if(valorAtual==="" || valorAtual==="0") {
        return valorAtual;
    }

    if(!validaUltimoDigito(valorAtual)) {
        return valorAtual; // não sobrescreve
    }

    var expressao = formataOperadores(valorAtual);
    expressao = calculaPorcento(expressao);

    var calculo=0;

    try {
        calculo = eval(expressao);   
        // padroniza decimal com 12 casas e no parse remove zeros a direita após o ponto
        return String(parseFloat(calculo.toPrecision(12)));
    } catch (erro) {
        mostraErro("Expressão mal formatada");
        return valorAtual;
    }
}

function ehInicio() {
    return valorAtual === "" || valorAtual === "0";
}

function validaPrimeiraTecla(tecla) {
    if(valorAtual==="" || valorAtual==="0") {
        return true;
    }

    var invalidoNoInicio = ["%", "÷", "x", "="];
    if (ehInicio() && invalidoNoInicio.includes(tecla)) {
        mostraErro("Expressão mal formatada");
        return false;
    }
    return true;
}

function executaCalculadora() {
    
    $(".tecla").click(function() {
        temErro = false;
        limpaErro();

        var tecla = $(this).text();
        if (tecla === ",") tecla = ".";

        if (!validaPrimeiraTecla(tecla)) {
            return;
        }

        if (tecla === ".") {
            var partes = valorAtual.split(/[%÷x\-+]/);
            var ultimaPrte = partes[partes.length - 1];
            // valorAtual.slice(-1) === "."

            // não permite ponto se já tiver um
            if (ultimaPrte.includes(".")) {
                return;
            }

            if (ultimaPrte === "" && !ehResultado) {
                tecla = "0.";
            }
        }

        if(tecla==="AC" || tecla==="C") {
            valorAtual = limpar(tecla);

        } else if(tecla==="=") {
            valorAtual = calcular();
            if (!temErro) {
                ehResultado = true;
            }

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

                if(operadores.includes(tecla) && operadores.includes(ultimo) && ultimo!="%") {
                    valorAtual = valorAtual.slice(0,-1) + tecla; // se for operador sobre operador, substitui
                } else {
                    valorAtual = valorAtual + tecla;
                }
            }
        }
       
        // console.log("valorAtual:",valorAtual)
        // console.log("ehResultado=",ehResultado)
        // console.log("tecla:",tecla)
        // console.log("temErro=",temErro)

        atualizar();
    });
}

executaCalculadora();
