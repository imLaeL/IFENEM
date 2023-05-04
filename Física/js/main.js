let questao = 0;

let data = require("../questoesSimulado.json");
let texto = data.questoes[questao].enunciado;
const holder = document.querySelector(".texto-simulado");
const alternativas = document.querySelector(".alternativas-simulado");
let alternativasArray = data.questoes[questao].alternativas;
const next = document.querySelector(".next");
const back = document.querySelector(".back");
let itemTabela = document.querySelectorAll(".tg-nsxs");
let respostas = new Array(10).fill(null);
const gabarito = [3, 0, 2, 0, 2, 1, 0, 1, 0, 0];
const finalizar = document.querySelector(".botao-finalizar");

itemTabela.forEach((item, index) => {
	item.addEventListener("click", () => {
		itemTabela[questao].classList.remove("slc");
		questao = index;
		itemTabela[questao].classList.add("slc");
		atualizaTexto();
		renderizaTexto(questao);
	});
});

finalizar.addEventListener("click", () => {
	calculaNota();
});

const { default: Swal } = require("sweetalert2");

const cronometro = document.querySelector(".cronometro");
let min = 30;
let seg = 0;

Swal.fire({
	title: "Você está pronto para começar o simulado?",
	text: `Você terá ${min} minutos para responder as questões`,
	icon: "warning",
	showCancelButton: true,
	confirmButtonColor: "#3085d6",
	cancelButtonColor: "#d33",
	confirmButtonText: "Sim, estou pronto!",
	cancelButtonText: "Não, quero voltar",
}).then((result) => {
	if (result.isConfirmed) {
		let timer = setInterval(() => {
			seg--;
			if (seg < 0) {
				seg = 59;
				min--;
			}
			let minFormat = min < 10 ? `0${min}` : min;
			let segFormat = seg < 10 ? `0${seg}` : seg;

			if (min === 0 && seg === 0) {
				clearInterval(timer);
				Swal.fire({
					title: "O tempo acabou!",
					text: "Seu simulado será finalizado",
					icon: "error",
					confirmButtonText: "Ok",
				}).then((result) => {
					if (result.isConfirmed) {
						calculaNota();
					}
				});
			}

			cronometro.innerHTML = `${minFormat}:${segFormat}`;
		}, 1000);
	} else {
		 window.location.href = "index.html";
	}
});

function atualizaTexto() {
	texto = data.questoes[questao].enunciado;
	alternativasArray = data.questoes[questao].alternativas;
	opcoes = document.querySelectorAll(".alternativa");
}

function renderizaTexto(questao) {
	holder.innerHTML = texto;
	alternativasArray.forEach((alternativa, index) => {
		alternativas.appendChild(document.createElement("label"));
		alternativas.children[index].classList.add("form-control");
		alternativas.children[
			index
		].innerHTML = `<input type="radio" name="radio" class="alternativa" />${alternativa}`;
	});
	if (respostas[questao] != null) {
		alternativas.children[respostas[questao]].children[0].checked = true;
	}
	pegaQuestaoMarcada(questao);
}
renderizaTexto(questao);

function pegaQuestaoMarcada(questao) {
	let opcoes = document.querySelectorAll(".alternativa");
	opcoes.forEach((opcao, index) => {
		opcao.addEventListener("click", () => {
			respostas.splice(questao, 1, index);
		});
	});
}

function calculaNota() {
	let nota = 0;
	respostas.forEach((resposta, index) => {
		if (resposta == null) {
			respostas.splice(index, 1, "%");
		}
		if (resposta == gabarito[index]) {
			nota++;
		}
	});
	respostas.join("");
	window.location.href = `./simulado-gabarito.html?respostas=${respostas}&nota=${nota}`;
}

function _back() {
	questao--;
	atualizaTexto();
	renderizaTexto(questao);
	itemTabela[questao + 1].classList.remove("slc");
	itemTabela[questao].classList.add("slc");
}

function _next() {
	questao++;
	if (questao == 10) {
		calculaNota();
	}

	atualizaTexto();
	renderizaTexto(questao);

	itemTabela[questao - 1].classList.remove("slc");
	itemTabela[questao].classList.add("slc");
}

next.addEventListener("click", () => {
	_next();
});

back.addEventListener("click", () => {
	_back();
});
