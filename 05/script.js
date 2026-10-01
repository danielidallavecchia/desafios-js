// Métodos úteis: replace, split, slice

var valorAtual = ""; 
var $resposta = $("#valor");
var ehResultado = false;
var temErro = false; // true enquanto houver mensagem no #msg-erro

var operadores = ["%", "÷", "x", "-", "+"];

var historico = [];

function limpaZeros() {
    if (valorAtual === "") valorAtual = "0";

    // remove zero a esquerda exceto antes de ponto decimal
    if (valorAtual.length > 1 && valorAtual[0] === "0" && valorAtual[1] !== "." && !operadores.includes(valorAtual[1])) {
        valorAtual = valorAtual.slice(1);
    }
}

function ajustaFonte() {
    var tamanho = "80px"; // padrão
    
    if (valorAtual.length > 9) {
        tamanho = "50px";
    } else if (valorAtual.length > 6) {
        tamanho = "60px";
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

function ajustaPonto() {
    if(valorAtual===".") {
        valorAtual = "0.";
    }
}

function formataNumero(numero) {
    var partes = numero.split(",");
    var inteiro = partes[0];
    var decimal = partes[1]; 

    if(Number.isNaN(inteiro)) { // se nao é um numero, ex:infinity
        return numero;
    }

    var respFinal = "";
    var j = 0;

    for(var i=inteiro.length-1; i>=0; i--) {
        respFinal = inteiro[i] + respFinal;
        j++;

        // a cada 3 dígitos, coloca um ponto
        if(j%3 == 0 && i>0) {
            respFinal = "." + respFinal;
        }
    }

    if (decimal !== undefined) {
        respFinal = respFinal + "," + decimal;
    }

    return respFinal;
}

function formataSaida(resp) {
    resp = resp.replace(/\./g, ",");  // troca ponto por vírgula pra exibir

    if(resp.length <= 3) {
        return resp;
    }

    var respFinal = "";
    var pedacos = resp.split(/([%÷x+\-])/);

    for (var i=0; i<pedacos.length; i++) {
        pedacos[i] = formataNumero(pedacos[i]);

        respFinal = respFinal + pedacos[i];
    }

    return respFinal;
}

function atualizar() {
    limpaZeros();
    ajustaFonte();
    ajustaPonto();

    $resposta.text(formataSaida(valorAtual));

    var posicaoAtual = $resposta[0].scrollWidth;
    $resposta.scrollLeft(posicaoAtual); 

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
        console.log("=>expressao=", expressao)
        console.log("=>calculo=", calculo)

        if (!Number.isFinite(calculo)) {
            return String(calculo); // Infinity, -Infinity, NaN
        }

        return String(parseFloat(calculo.toPrecision(15))); // se ultrapssar, usa notação
    } catch (erro) {
        mostraErro("Expressão mal formatada");
        return valorAtual;
    }
}

function ehInicio() {
    return valorAtual === "" || valorAtual === "0";
}

function validaTecla(tecla) {
    var invalidoNoInicio = ["÷", "x", "=", "+", "-"];

    if (ehInicio() && invalidoNoInicio.includes(tecla)) {
        return false; // se for no inicio ignora sem digitar nada e sem mostrar erro
    }

    var ultimoDigito = valorAtual.slice(-1);
    if(tecla==="%" && ultimoDigito==="%") {
        return false; // não permite informar dois % sequidos
    }

    return true;
}

function inverteSinal() {
    if(!validaUltimoDigito(valorAtual)) {
        return valorAtual; // não sobrescreve
    }

    var partes = valorAtual.split(/[÷x\-+]/); // separa por operadores
    var ultimaParte = partes[partes.length - 1]; // ultimo

    if (ultimaParte==="") {
        return valorAtual;    
    }

    var antes = valorAtual.slice(0, valorAtual.length-ultimaParte.length); // expressao antes do ultimo numero

    var ultimo = antes.slice(-1); // caractere antes do ultimo numero
    var penultimo = antes.slice(-2, -1); // caracter antes do acima

    // console.log("ultimaParte=",ultimaParte)
    // console.log("antes=",antes)
    // console.log("ultimo=",ultimo)
    // console.log("penultimo=",penultimo)

    if(antes==="") {
        // adiciona negativo
        antes = "-";

    } else if (ultimo==="+") {
        // troca para negativo
        antes = antes.slice(0, -1) + "-";

    } else if(ultimo==="-") {
        // se ja tiver um "-"
        if(antes.length === 1 || operadores.includes(penultimo)) {
            // remove o "-"
            antes = String(antes.slice(0, -1));
        } else {
            // adiciona o "+"
            antes = String(antes.slice(0, -1) + "+");
        }
    } else {
        antes = antes + "-";
    }

    // console.log("2 antes=",antes)

    valorAtual = antes + ultimaParte;
    return valorAtual;
}

function processaTecla(tecla) {
    console.log("TECLA=",tecla)
    temErro = false;
    limpaErro();

    if (tecla === ",") tecla = ".";

    if (!validaTecla(tecla)) {
        return;
    }

    if (tecla === "%" && ehInicio()) {
        valorAtual = "0"; // pra resultar em "0%"
    }

    if (operadores.includes(tecla) && valorAtual.slice(-1) === ".") { // não permite operador depois de um ponto
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
        var conta = valorAtual;
        valorAtual = calcular();

        if (!temErro) {
            ehResultado = true;
            if (conta != valorAtual) {
                historico.push(formataSaida(conta) + " = " + formataSaida(valorAtual));
                atualizarHistorico();
            }
        }

    } else if(tecla === "+/-") {
        valorAtual = inverteSinal();
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
}

function executaCalculadora() {
    $(".tecla").click(function() {
        var tecla = $(this).text();
        processaTecla(tecla);
    });
}

function atualizarHistorico() {
    var $texto = $("#texto-historico");

    if (historico.length === 0) {
        $texto.text("Sem histórico disponível");
        return;
    }

    if (historico.length > 10) {
        historico = historico.slice(1, historico.length);
    }

    var html = "";
    for(var i=0; i<historico.length; i++) {
        html += historico[i] + "<br>";
    }
    $texto.html(html);

    $texto.scrollTop($texto[0].scrollHeight);
}

document.getElementById("img-limpar").addEventListener("click", function(event) {
    historico = [];
    atualizarHistorico();
});

document.getElementById("img-historico").addEventListener("click", function(event) {
    var $imgLimpar = $("#img-limpar");
    var $imgTexto = $("#texto-historico");

    $imgLimpar.toggle();
    $imgTexto.toggle();
    $imgTexto.scrollTop($imgTexto[0].scrollHeight);
});

document.addEventListener("keydown", function(event) {
    var key = event.key;

    if (key === 'Delete') {
        processaTecla("AC");
    } else if (key === 'Backspace') {
        processaTecla("C");
    } else if (key === 'Enter' || key === "=") {
        processaTecla("=");
    } else {
        var teclasPermitidas = ["0","1","2","3","4","5","6","7","8","9",
            ",","+","-",".","/","*","%"];
        
        if(teclasPermitidas.includes(key)) {
            if(key==="/") {
                key= "÷";
            } else if(key==="*") {
                key= "x";
            }
            processaTecla(key);
        }
    }
});

executaCalculadora();
