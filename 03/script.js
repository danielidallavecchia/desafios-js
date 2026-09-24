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

function mostraJogadaPc(escolhaPc) {

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

    pontosEu.textContent = placarEu;
    pontosPc.textContent = placarPc;
    pontosEmpate.textContent = placarEmpate;
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

// TODO: mudar imagem da jogada e dps alinhá-la com o imagem do pc
function mudaJogadaPc(jogada) {
    var $imgPcJogou = $("#computador-jogou");

    if (jogada === "pedra") {
        $imgPc.attr("src", "../img/pedra.png");
    } else if (jogada === "papel") {
        $imgPc.attr("src", "../img/papel.png");
    } else if (jogada === "tesoura") {
        $imgPc.attr("src", "../img/tesoura.png");
    }
    
    $imgPc.show();
}

function alteraItemsByResultado(tipo) {
    mudaTextoVencedor(tipo);
    mudaImgPc(tipo);
}

function jogar(escolhaUsuario) {
    var escolhaPc = pcJoga();

    console.log("escolhaUsuario = ", escolhaUsuario);
    console.log("escolhaPc = ", escolhaPc);

    mostraJogadaPc(escolhaPc);

    if(escolhaUsuario === escolhaPc) {
        placarEmpate++;
        alteraItemsByResultado("empate");
    } else if (
        (escolhaUsuario === "pedra" && escolhaPc === "tesoura") ||
        (escolhaUsuario === "papel" && escolhaPc === "pedra") ||
        (escolhaUsuario === "tesoura" && escolhaPc === "papel")
    ) {
        placarEu++;
        alteraItemsByResultado("eu");
    } else {
        placarPc++;
        alteraItemsByResultado("pc");
    }

    atualizarPontos();
};

euJogo();
