const SELECTORS = {
    BANNER: "#box-banner>h1",
    CODE_CONTAINER: "#box-code",
    OPTIONS_CONTAINER: "#box-options > ul",
    ARROW_RIGHT: ".fa-arrow-right",
    RESET: ".box-reset > div",
};

class GameNextQuestion {
    constructor(jsonPerguntas) {
        this.jsonPerguntas = jsonPerguntas;
        this.render(this.jsonPerguntas.length-1);      
            }

    render(numero) {
        if (this.jogoAcabou())
            return;
       
        const enunciado = this.jsonPerguntas[numero].pergunta;
        const codigo = this.jsonPerguntas[numero].codigo;
        const opcoes = this.jsonPerguntas[numero].opcoes;

        document.querySelector(SELECTORS.BANNER).innerText = enunciado;
        document.querySelector(SELECTORS.CODE_CONTAINER).innerHTML = `
            ${codigo === "" ? "<h1>Sem codigo</h1>" : "<h1>codigo </h1>"}
            <code>${codigo}</code>
        `;
        document.querySelector(SELECTORS.OPTIONS_CONTAINER).innerHTML = "";

        opcoes.forEach((element, i) => {
            const resposta = element.resposta;
            const html = `
                <li class="box-option">
                    <div class="box-option-orange">
                        <div>
                            <p>${i + 1}</p>
                        </div>
                    </div>
                    <div class="box-option-yellow" data-q="${element.correta}">
                        <div data-q="${element.correta}">
                            <p data-q="${element.correta}">${resposta}</p>
                        </div>
                    </div>
                </li>
            `;
            document.querySelector(SELECTORS.OPTIONS_CONTAINER).insertAdjacentHTML("beforeend", html);
        });

        const respostasHTML = document.querySelectorAll(".box-option-yellow");
        respostasHTML.forEach(e => {
            e.addEventListener("click", (evt) => {
                if (evt.target.dataset.q == "true") {
                    pontos++;
                    respostasHTML.forEach(a => this.clicaNaResposta(a));
                } else {
                    respostasHTML.forEach(a => this.clicaNaResposta(a));
                }
            }, { once: true });
        });

        // retira pergunta ja renderizada do array
        this.jsonPerguntas.splice(-1,1)
    }

    clicaNaResposta(e) {
        if (e.dataset.q == "true") {
            e.style.backgroundColor = "green";
        } else {
            e.style.backgroundColor = "red";
        }
    }
    jogoAcabou() {
        if (this.jsonPerguntas.length <= 0) {
            document.querySelector(SELECTORS.OPTIONS_CONTAINER).innerHTML = "";

            document.querySelector(SELECTORS.BANNER).innerText = "Obrigado por jogar";
            document.querySelector(SELECTORS.CODE_CONTAINER).innerHTML = `
                <h1>Sua pontuação foi ${pontos}</h1>
                <code>console.log("você sabe muito")</code>
            `;
            console.log("Jogo acabou. Pontuação final:", pontos);
            return true;
        }
        return false;
    }
}
let perguntas
let pontos = 0
window.addEventListener("load", () => {
    fetch('./assets/data.json')
        .then((response) => response.json())
        .then((json) => {
            perguntas = json.perguntas;
            new GameNextQuestion(perguntas);
        });
});

document.querySelector(SELECTORS.ARROW_RIGHT).addEventListener("click", evt => {
    evt.preventDefault();
    // passa para proxima pergunta
    console.log("Sua pontuação é", pontos);
    new GameNextQuestion(perguntas);
});

document.querySelector(SELECTORS.RESET).addEventListener("click", (evt) => {
    // reseta o game
    fetch('./assets/data.json')
    .then((response) => response.json())
    .then((json) => {
        perguntas = json.perguntas;
        pontos = 0
        new GameNextQuestion(perguntas);
    });
})
