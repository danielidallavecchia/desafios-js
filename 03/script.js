// Funções úteis: 
// click()
// if / else if / else
// variáveis
// funções
// arrays
// Math.random()
// Math.floor()
// setTimeout()
// .text()
// .attr()
// .addClass()
// .removeClass()
// .css()

const respostas = ["pedra", "papel", "tesoura"];

var placarEu=0, placarPc=0, placarEmpate=0;

document.getElementById("recarrega").addEventListener("click", function(event) {
    placarEu = 0;
    placarPc = 0;
    placarEmpate = 0;

    atualizarPontos();

    document.getElementById("texto-vencedor").textContent = "";
    document.getElementById("computador").style.display = "none";
    document.getElementById("computador-jogou").style.display = "none";
    document.getElementById("computador-wait").style.display = "block";
    
    window.location.reload();
});

function pcJoga() {
    const indiceAleatorio = Math.floor(Math.random() * respostas.length);
    return respostas[indiceAleatorio];
};

function euJogo() {
    const pedra = document.getElementById("pedra");
    const papel = document.getElementById("papel");
    const tesoura = document.getElementById("tesoura");

    pedra.addEventListener("click", () => jogar("pedra"));
    papel.addEventListener("click", () => jogar("papel"));
    tesoura.addEventListener("click", () => jogar("tesoura"));
};

function atualizarPontos() {
    const pontosEu = document.getElementById("pontos-eu");
    const pontosPc = document.getElementById("pontos-pc");
    const pontosEmpate = document.getElementById("pontos-empate");

    setTimeout(() => {
        pontosEu.textContent = placarEu;
        pontosPc.textContent = placarPc;
        pontosEmpate.textContent = placarEmpate;
    }, 1500);
};

function mudaTextoVencedor(tipo) {
    var $texto = $("#texto-vencedor");

    $texto.fadeOut(300, function() {
        if (tipo === "empate") {
            $texto.text("Empate!");
        } else if (tipo === "eu") {
            $texto.text("Você ganhou!");
        } else if (tipo === "pc") {
            $texto.text("Computador ganhou!");
        }

        $texto.fadeIn(500);
    });
}

function mudaImgPc(tipo) {
    var $imgPc = $("#computador");
    var $imgWait = $("#computador-wait");

    $imgWait.hide(); 

    if (tipo === "empate") {
        $imgPc.attr("src", "../img/pc_empate.png");
    } else if (tipo === "eu") {
        $imgPc.attr("src", "../img/pc_perdeu.png");
    } else if (tipo === "pc") {
        $imgPc.attr("src", "../img/pc_venceu.png");
    }
    
    $imgPc.show();
}

function mudaJogadaPc(escolhaPc) {
    var $imgPcJogou = $("#computador-jogou");

    if (escolhaPc === "pedra") {
        $imgPcJogou.attr("src", "../img/pedra.png");
    } else if (escolhaPc === "papel") {
        $imgPcJogou.attr("src", "../img/papel.png");
    } else if (escolhaPc === "tesoura") {
        $imgPcJogou.attr("src", "../img/tesoura.png");
    }
    
    $imgPcJogou.show();
}

function alteraItemsByResultado(tipo, escolhaPc) {
    var $imgWait = $("#computador-wait");
    var $imgPc = $("#computador");
    var $imgPcJogou = $("#computador-jogou");

    $imgPc.hide();
    $imgPcJogou.hide();
    $imgWait.show();

    setTimeout(() => {
        mudaTextoVencedor(tipo);
        mudaImgPc(tipo);
        mudaJogadaPc(escolhaPc);
    }, 1000);
     
}

function jogar(escolhaUsuario) {
    var escolhaPc = pcJoga();

    var pcWait = document.getElementById("computador-wait"); 
    pcWait.src = "../img/computador_pensando.png";

    console.log("escolhaUsuario = ", escolhaUsuario);
    console.log("escolhaPc = ", escolhaPc);


    if(escolhaUsuario === escolhaPc) {
        placarEmpate++;
        alteraItemsByResultado("empate", escolhaPc);
    } else if (
        (escolhaUsuario === "pedra" && escolhaPc === "tesoura") ||
        (escolhaUsuario === "papel" && escolhaPc === "pedra") ||
        (escolhaUsuario === "tesoura" && escolhaPc === "papel")
    ) {
        placarEu++;
        alteraItemsByResultado("eu", escolhaPc);
    } else {
        placarPc++;
        alteraItemsByResultado("pc", escolhaPc);
    }

    atualizarPontos();
};

euJogo();
