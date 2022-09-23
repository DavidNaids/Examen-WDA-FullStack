console.clear(); // limpiamos la consola
// Hola! En esta oportunidad usaremos la PokeAPI https://pokeapi.co/docs/v2
// En este caso es una API JSON

//Trending
const APITrending = "https://api.giphy.com/v1/gifs/trending?api_key=e1mozwZEVA7bZChthwDoxbttVQzyI4aD&limit=9";
//Busqueda
const APIGifSearch = "https://api.giphy.com/v1/gifs/search?api_key=e1mozwZEVA7bZChthwDoxbttVQzyI4aD&limit=9";
//Traer elementos de html
const boton = document.querySelector('#boton');
const form = document.querySelector("#formulario");
const finish = document.querySelector(".final");

let offsets = 0;
let offtrends = 9;
let offsearch = 9;
let recientes = 0;
let observador;

const añadirCardGif = (giphy) => {
  // crea un nuevo div y añade contenido
  const contenedor = document.createElement("div");
  contenedor.className = "cards";
  const contenido = document.createElement("p");
  contenido.className = "Autor";
  contenido.innerText = "Subido por: " + (giphy.username.trim() || "Desconocido"); 
  const contenedorImagen = document.createElement("img");
  contenedorImagen.src = giphy.images.original.webp;
  contenedorImagen.alt = giphy.title.trim() || "Desconocido";

  contenedor.appendChild(contenido); //añade texto al div creado.
  contenedor.appendChild(contenedorImagen);
  // añade el elemento creado y su contenido al DOM
  document.querySelector(".grid").appendChild(contenedor);
};

const inicioScroll = () =>{
    const Iobservador = new IntersectionObserver(entradas => {
        console.log("entro al observador");
        if(entradas[0].IntersectionRatio <= 0){
            return;
        }
        console.log("entro al ciclo")
        offsets += offtrends;
        const link = `${APITrending}&offset=${offsets}`
        console.log(link)
        cargar (link);
    });
    Iobservador.observe(finish);
    return Iobservador;
}
const inicioScrollsearch = (ruta) =>{ 
    const Iobservador = new IntersectionObserver(entradas => {
        console.log("entro al observador");
        if(entradas[0].IntersectionRatio <= 0){
            return;
        }
        console.log("entro al ciclo")
        offsets += offsearch;
        let link = `${ruta}&offset=${offsets}`
        console.log(link)
        cargar (link);
    });
    Iobservador.observe(finish);
    return Iobservador;
}
const prevent = (e) => {
    e.preventDefault();
    buscar();
}

const sinresultados= () =>{
    imprimirhistorial ();
}

const imprimirhistorial = () =>{
    limpiarrecientes();
    const contenthistory = document.createElement("ul");
    contenthistory.className = "listarecientes";
    const historial1 = document.createElement("li");
    const historial2 = document.createElement("li");
    const historial3 = document.createElement("li");

    const hi1 = document.createElement("a");
    hi1.innerText = localStorage.getItem("recent1");
    hi1.addEventListener("click", buscarhistorico);
    hi1.className = "recientes";
    const hi2 = document.createElement("a");
    hi2.innerText = localStorage.getItem("recent2");
    hi2.addEventListener("click", buscarhistorico);
    hi2.className = "recientes";
    const hi3 = document.createElement("a");
    hi3.innerText = localStorage.getItem("recent3");
    hi3.addEventListener("click", buscarhistorico);
    hi3.className = "recientes";

    historial1.appendChild(hi1);
    historial2.appendChild(hi2);
    historial3.appendChild(hi3);

    contenthistory.appendChild(historial1);
    contenthistory.appendChild(historial2);
    contenthistory.appendChild(historial3);

    document.querySelector(".historia").appendChild(contenthistory);
}

const buscarhistorico = async function(e){
    console.log(e.target.innerText);
    limpiar ();
    observador.unobserve(finish);
    offsets = 0;
    const ruta = `${APIGifSearch}&q=${e.target.innerText}`;
    const {data: gifo} = await obtenerGif(ruta);
    if(gifo.length === 0){
        alert ('No se han encontrado resultados');
        sinresultados();
        return;
    }
    imprimirhistorial ();
    console.log(gifo);
    for (let giphy of gifo) {
        añadirCardGif(giphy);
    }
    observador = inicioScrollsearch(ruta);
}

const modificarlocalstorage = () =>{
    let mod1 = localStorage.getItem("recent1");
    let mod2 = localStorage.getItem("recent2");
    let mod3 = localStorage.getItem("recent3");
    let temp = 0;

    localStorage.setItem("recientes4", mod3)

    temp = mod1;

    mod1 = mod2;
    localStorage.setItem("recent1", mod1);
    
    mod2 = temp;
    localStorage.setItem("recent2", mod2);
}
const modificarlocalstorage2 = () =>{

    let mod1 = localStorage.getItem("recent1");
    let mod2 = localStorage.getItem("recent2");
    let mod3 = localStorage.getItem("recent3");

        mod1 = mod2;
        localStorage.setItem("recent1", mod1);

        mod2 = mod3;
        localStorage.setItem("recent2", mod2);
}

const guardarconsola = () =>{
    if (localStorage.length === 4){
        modificarlocalstorage2();
        localStorage.setItem("recent3", recientes);
    }
    if (localStorage.length === 3){
        modificarlocalstorage();
        localStorage.setItem("recent3", recientes);
    }
    if (localStorage.length === 2){
        localStorage.setItem("recent1", recientes);
    }
    if (localStorage.length === 1){
        localStorage.setItem("recent2", recientes);
    }
    if (localStorage.length === 0){
        localStorage.setItem("recent3", recientes);
    }
}

const buscar = async function () {
    const entrada = document.getElementById("busqueda").value;
    if(entrada.trim() === ""){
        alert ('Parametro de busqueda vacio, escriba algo');
        return;
    }
    limpiar();
    observador.unobserve(finish);
    console.log(entrada);
    recientes = entrada;
    guardarconsola();
    offsets = 0;
    let ruta = `${APIGifSearch}&q=${entrada}`;
    const {data: gifo} = await obtenerGif(ruta);
    if(gifo.length === 0){
        alert ('No se han encontrado resultados');
        sinresultados();
        return;
    }
    imprimirhistorial ();
    console.log(gifo);
    for (let giphy of gifo) {
        añadirCardGif(giphy);
    }
    observador = inicioScrollsearch(ruta);

}
  
// }
const obtenerGif = async function (url) {
  const respuesta = await fetch(url);
  const giphys = await respuesta.json();
  return giphys;
}


const limpiar = () => {
  document.querySelector(".grid").innerHTML = "";
}
const limpiarrecientes = () => {
    document.querySelector(".historia").innerHTML = "";
}

const cargar = async (url) => {
  const giphys = await obtenerGif(url);
  for (let giphy of giphys.data) {
    añadirCardGif(giphy);
    
    }
};

form.addEventListener('submit', prevent);
cargar(APITrending);
boton.addEventListener('click', buscar);
imprimirhistorial();
observador = inicioScroll();