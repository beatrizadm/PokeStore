const URL = 'https://pokeapi.co/api/v2/pokemon';
const pokemons = document.getElementById('pokemons');

let apiData;
let infoPokemon;
let apiDataDetalhes;
let carrinho = document.getElementById("itensCarrinho");
let precoTotal = document.getElementById("precoTotal");
let btnFinalizar = document.getElementById("finalizar");
let precoExibido = 0;

//Para receber a API
const fetchAPI = async (urlApi) => {
	let response = await fetch(urlApi);
	const textResponse = await response.text();
	return JSON.parse(textResponse);			//devolve a api no formato JSON
}

//Para paginar os dados
let currentPage = 1;
const ITENS_PER_PAGE = 20;

//Para criar o menu de navegação entre as páginas do resultado
const renderPaginationMenu = (apiDataDetalhes) =>{
	const paginationContainer = document.querySelector('.pagination'); //pega a div com a classe pagination

	//para limpar a div:
	while (paginationContainer.firstChild){
		paginationContainer.removeChild(paginationContainer.firstChild);
    }
    
    //botão de voltar
	const previousPage = document.createElement('div');
	previousPage.setAttribute('class', 'page-item btn border');
	previousPage.innerHTML = '< Pagina anterior';
	previousPage.addEventListener('click', () =>{
		currentPage <= 1 ? () => {} : paginaAnterior();
	});

	if (currentPage === 1){
		previousPage.disabled = true;
		previousPage.style.cursor = 'default';
	}
	paginationContainer.appendChild(previousPage);

	//botão de avançar
	const nextPage = document.createElement('div');
	nextPage.setAttribute('class', 'page-item btn border');
	nextPage.innerHTML = 'Próxima pagina >';
	nextPage.addEventListener('click', () => {
        proximaPagina();}
	);

	paginationContainer.appendChild(nextPage);

}

const proximaPagina = async () => {
	const {next} = apiData
	if (next != null){
		apiData = await fetchAPI(next);
		changePage(1);
	}
}

const paginaAnterior = async () => {
    const {previous} = apiData
	apiData = await fetchAPI(previous);
	changePage(-1);
}


//método para contar as páginas:
const changePage = (paginasExibidas) => {
    currentPage += paginasExibidas;
    apiDataDetalhes = apiData['results'];
    criarcards();
}


//Para criar os cards
const renderPage = async () =>{
    apiData = await fetchAPI(URL);
    apiDataDetalhes = apiData['results'];
    criarcards();
}

const criarcards = () => {
	pokemons.innerHTML = "";

    renderPaginationMenu(apiDataDetalhes); //para puxar o menu de navegação entre as páginas
    	
    apiDataDetalhes.forEach(async property => {
        const { name, url } = property;

		apiDataInfos = await fetchAPI(url);
		apiImages = apiDataInfos['sprites']
		let imgAtual = apiImages['front_default'];

		let preco_pok = 10;

		let coluna = document.createElement('div');
		coluna.setAttribute('class', 'col-sm-6 col-lg-4 margem_baixo');

		let card = document.createElement('div');
		card.setAttribute('class', 'card resultado text-center bg-light border-secondary');

		let imagem = document.createElement('img');
		imagem.setAttribute('class', 'card-img-top');
		imagem.setAttribute('src', imgAtual);

		let cardbody = document.createElement('div');
		cardbody.setAttribute('class', 'card-body');

		let titulo = document.createElement('h4');
		titulo.setAttribute('class', 'card-title');
		titulo.innerHTML = name;

		let preco = document.createElement('h5');
		preco.setAttribute('class', 'card-text bg-transparent');
		preco.innerHTML = `R$${preco_pok.toFixed(2)}`;

		let rodape = document.createElement('div');
		rodape.setAttribute('class', 'card-footer btn bg-transparent');

		let comprar = document.createElement('button');
		comprar.setAttribute('class', 'btn btn-comprar bg-transparent');
		comprar.innerHTML = 'Adicionar ao carrinho';

		card.appendChild(imagem);
		cardbody.appendChild(titulo);	
		card.appendChild(cardbody);
		card.appendChild(preco);
		rodape.appendChild(comprar);
		card.appendChild(rodape);
		coluna.appendChild(card);
		pokemons.appendChild(coluna);

		card.onmouseover = function (){
			card.style.boxShadow = "8px 8px 20px rgb(202, 0, 0)";
		}

		card.onmouseout = function (){
			card.style.boxShadow = "5px 5px 15px #3B4CCA";
		}

		comprar.onclick = () => {
			inserirNoCarrinho(imgAtual, name, preco_pok);
		}

		if (precoExibido === 0){
			btnFinalizar.style.display = 'none';
		}
		else{
			btnFinalizar.style.display = 'block';
		}

	})
}

const inserirNoCarrinho = (imgAtual, name, preco_pok) => {
	let item = document.createElement('div');
	item.setAttribute('class', 'margem_baixo item_carrinho');

	let item_img = document.createElement('img');
	item_img.setAttribute('class', 'img_item');
	item_img.setAttribute('src', imgAtual);
	item_img.setAttribute('align', 'left');

	let item_nome = document.createElement('p');
	item_nome.innerHTML = name;

	let item_qtd = document.createElement('input');
	item_qtd.setAttribute("type", "number");
	item_qtd.setAttribute('class', 'input_item');
	item_qtd.value = 1;

	let item_preco = document.createElement('p');
	item_preco.setAttribute('class', 'preco_item');
	item_preco.innerHTML = `R$${preco_pok * item_qtd.value},00`;

	let hr = document.createElement('hr');

	let btnremove = document.createElement('button');
	btnremove.setAttribute('class', 'btn btn-remover bg-transparent');
	btnremove.innerHTML = 'X';

	let precoParcial = preco_pok * item_qtd.value
	precoExibido += precoParcial;
	precoTotal.innerHTML = `Total: R$${precoExibido},00`;

	item.append(item_img);
	item.append(item_nome);
	item.append(item_qtd);
	item.append(item_preco);
	item.append(btnremove);
	item.append(hr);
	carrinho.append(item);

	if (precoExibido === 0){
		btnFinalizar.style.display = 'none';
	}
	else{
		btnFinalizar.style.display = 'block';
	}

	btnremove.onclick = () => {
		item.remove();
		precoExibido -= precoParcial
		precoTotal.innerHTML = `Total: R$${precoExibido},00`;

		if (precoExibido === 0){
			btnFinalizar.style.display = 'none';
		}
		else{
			btnFinalizar.style.display = 'block';
		}
	}

	item_qtd.onchange = () => {
		precoExibido -= precoParcial;
		precoParcial = preco_pok * item_qtd.value;
		precoExibido += precoParcial;
		item_preco.innerHTML = `R$${preco_pok * item_qtd.value},00`;
		precoTotal.innerHTML = `Total: R$${precoExibido.toFixed(2)}`;
	}
}


renderPage();
