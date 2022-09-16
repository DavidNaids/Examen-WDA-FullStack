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

let recientes = 0;

const añadirCardGif = (giphy) => {
  // crea un nuevo div y añade contenido
  const contenedor = document.createElement("div");
  contenedor.className = "cards";
  const contenido = document.createElement("p");
  contenido.className = "Autor";
  contenido.innerText = "Subido por: " + giphy.username; 
  const contenedorImagen = document.createElement("img");
  contenedorImagen.src = giphy.images.original.webp;

  contenedor.appendChild(contenido); //añade texto al div creado.
  contenedor.appendChild(contenedorImagen);
  // añade el elemento creado y su contenido al DOM
  document.querySelector(".grid").appendChild(contenedor);
};
const prevent = (e) =>{
    e.preventDefault();
    buscar();
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
    console.log(entrada);
    recientes = entrada;
    guardarconsola();
    const ruta = `${APIGifSearch}&q=${entrada}`;
    const {data: gifo} = await obtenerGif(ruta);
    if(gifo.length === 0){
        alert ('No se han encontrado resultados');
        return;
    }
    console.log(gifo);
    for (let giphy of gifo) {
        añadirCardGif(giphy);
    }

};
  
// }
const obtenerGif = async function (url) {
  const respuesta = await fetch(url);
  const giphys = await respuesta.json();
  return giphys;
};


const limpiar = () => {
  document.querySelector(".grid").innerHTML = "";
};

const cargar = async (url) => {
  const giphys = await obtenerGif(url);
  for (let giphy of giphys.data) {
    añadirCardGif(giphy);
  }

};

form.addEventListener('submit', prevent);
cargar(APITrending);
boton.addEventListener('click', buscar);