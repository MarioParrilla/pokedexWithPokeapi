let selectOrientacionImagenes = document.getElementById("selectImagenes");
let botonBusqueda = document.getElementById("botonBusqueda");
let pokemonABuscar = document.getElementById("buscador");
let divDeSalida = document.getElementById("out");
let divDeInfo = document.getElementById("info");
let data;

botonBusqueda.addEventListener("click",()=>{
    recibirInfoPokemonBoton();
},false)

async function recibirInfoPokemonBoton() {
    let valorBuscador = pokemonABuscar.value;
    if(valorBuscador=="") datoVacio();
    else if(isNaN(valorBuscador)==false)recibirInfoPokemonIndex(valorBuscador);
    else{
        try {
            let pokemon = pokemonABuscar.value.toLowerCase();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            data = await response.json();
            mostrarInfoPokemon(data);
        } catch (error) {
            busquedaFallida(error);
        }
    }
}

async function recibirInfoPokemonIndex(posicionPokedex) {
    if(posicionPokedex==0){
        datoValorCero();
    }else{
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${posicionPokedex}`);
            data = await response.json();
            mostrarInfoPokemon(data);
        } catch (error) {
            busquedaFallida(error);
        }
    }
}

async function recibirInfoExterna(enlaceAPI, fuc) {
    if(enlaceAPI==""){
        datoValorCero();
    }else{
        try {
            const response = await fetch(`${enlaceAPI}`);
            fuc(await response.json());
        } catch (error) {
            busquedaFallida(error);
        }
    }
}

function busquedaFallida(error) {
    console.log(error);
    document.getElementById('out').innerHTML='';
    document.getElementById('info').innerHTML='';
    divDeInfo.innerHTML=`<div class="alert alert-danger" role="alert">El pokemon que busca no existe!</div>`;
    
}

function datoValorCero() {
    document.getElementById('out').innerHTML='';
    document.getElementById('info').innerHTML='';
    divDeInfo.innerHTML=`<div class="alert alert-primary" role="alert">La posicion mínima en la pokedex debe de ser 0</div>`;
}

function datoVacio() {
    document.getElementById('out').innerHTML='';
    document.getElementById('info').innerHTML='';
    divDeInfo.innerHTML=`<div class="alert alert-info" role="alert">Introduce un valor valido!</div>`;
}

async function mostrarInfoPokemon(infoPokemon) {
    document.getElementById('out').innerHTML='';
    document.getElementById('info').innerHTML='';
    let idPokemonActual = infoPokemon.id;

    divDeSalida.innerHTML=`<div class="card text-center">
    <div class="card-header">
        <a onclick=recibirInfoPokemonIndex(${idPokemonActual-1}) ><button type="button" class="btn btn-dark" id="botonBusqueda">Anterior</button></a>
        Numero de pokedex: <b>${idPokemonActual}</b>
        <a onclick=recibirInfoPokemonIndex(${idPokemonActual+1}) ><button type="button" class="btn btn-dark" id="botonBusqueda">Siguiente</button></a>
        </div>
        <div class="card-body">
            <h5 class="card-title" style="display:inline;">Nombre del Pokemon: <span class="badge bg-dark">${infoPokemon.name}</span></h5>
            <br><br>
            <select class="form-select text-center" aria-label="Sprite" id='tiposImagenes' onChange=cargarImagenPokemon() style="width:30%;margin-left: auto;margin-right: auto;"></select>
            <div id='divImagenes'></div>
            <h5 class="card-title" id='tipo'>Tipo:</h5>
            <h5 class="card-title" id='habilidades'>Habilidades:</h5>
            <h5 class="card-title" id='habilidades'>Altura: <b>${infoPokemon.height}</b></h5>
            <h5 class="card-title" id='habilidades'>Peso: <b>${infoPokemon.weight}</b></h5>
            <hr>
            <p>
                <a class="btn btn-primary" data-bs-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Donde Encontrar</a>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">Movimientos</button>
            </p>
            <div class="row">
                    <div class="col">
                    <div class="collapse multi-collapse" id="multiCollapseExample1">
                        <div class="card card-body">
                            <div style="width:50%; margin-left: auto;margin-right: auto;">
                                <h2 class="card-title">Aparece en</h2>
                                <ul class="list-group" id="listaSitios"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="collapse multi-collapse" id="multiCollapseExample2">
                        <div class="card card-body">
                            <div style="width:50%; margin-left: auto;margin-right: auto;">
                                <h2 class="card-title">Movimientos</h2>
                                <ul class="list-group" id="listaAtaques"></ul>
                            </div>
                        </div>
                </div>
            </div>

        </div>
    </div>`
    cargarSprites(infoPokemon);
    cargarImagenPokemon();
    cargarTipos(infoPokemon);
    cargarHabilidades(infoPokemon);
    recibirInfoExterna(infoPokemon.location_area_encounters,cargarSitiosEncontrar);
    cargarMovimientos(infoPokemon);
}

function cargarSprites(infoPokemon) {
    for (const key in infoPokemon.sprites) {
        if(key=='other') continue;
        else if(key=='versions') continue;
        else if(infoPokemon.sprites[key]!=null) document.getElementById('tiposImagenes').add(new Option(key));
    }
}

function cargarImagenPokemon() {
    let divImagenes = document.getElementById('divImagenes');
    let selectTipoImagen = document.getElementById('tiposImagenes');
    divImagenes.innerHTML = `<img src=${data.sprites[selectTipoImagen.value]}>`
}

function cargarTipos(infoPokemon) {
    let tipos="";
    for (let i = 0; i < infoPokemon.types.length; i++) {
        if(i==0) tipos+="Tipo: "+comprobarTipos(infoPokemon.types[i].type.name);
        else tipos+=" | "+comprobarTipos(infoPokemon.types[i].type.name);
    }
    document.getElementById('tipo').innerHTML = `${tipos}`;
}

function cargarHabilidades(infoPokemon) {
    let habilidades="";
    for (let i = 0; i < infoPokemon.abilities.length; i++) {
        if(i==0) habilidades+="Habilidades: "+infoPokemon.abilities[i].ability.name;
        else habilidades+=" | "+infoPokemon.abilities[i].ability.name;
    }
    document.getElementById('habilidades').innerHTML = `${habilidades}`;
}

function cargarMovimientos(infoPokemon) {
    for (const key in infoPokemon.moves) {
        var ul = document.getElementById("listaAtaques");
        var li = document.createElement(`li`);
        li.setAttribute("class", "list-group-item list-group-item-dark");
        li.appendChild(document.createTextNode(`${infoPokemon.moves[key].move.name}`));
        ul.appendChild(li);
    }
}

function cargarSitiosEncontrar(infoPokemon) {
    if (infoPokemon.length==0) {
        var ul = document.getElementById("listaSitios");
            var li = document.createElement(`li`);
            li.setAttribute("class", "list-group-item list-group-item-dark");
            li.appendChild(document.createTextNode(`Ningún lado`));
            ul.appendChild(li);
    }else{
        for (let i = 0; i < infoPokemon.length; i++) {
            var ul = document.getElementById("listaSitios");
            var li = document.createElement(`li`);
            li.setAttribute("class", "list-group-item list-group-item-dark");
            li.appendChild(document.createTextNode(`${infoPokemon[i].location_area.name}`));
            ul.appendChild(li);
        }
    }
}

function comprobarTipos(tipo) {
    switch (tipo) {
        case "grass":
            return `<p style='display:inline; color: green'>${tipo}</p>`
            break;
        case "normal":
            return `<p style='display:inline; color: burlywood'>${tipo}</p>`
            break;
        case "poison":
            return `<p style='display:inline; color: purple'>${tipo}</p>`
            break;
        case "fire":
            return `<p style='display:inline; color: orange'>${tipo}</p>`
            break;
        case "water":
            return `<p style='display:inline; color: blue'>${tipo}</p>`
            break;
        case "electric":
            return `<p style='display:inline; color: yellow'>${tipo}</p>`
            break;
        case "flying":
            return `<p style='display:inline; color: gray'>${tipo}</p>`
            break;
        case "bug":
            return `<p style='display:inline; color: greenyellow'>${tipo}</p>`
            break;
        case "ground":
            return `<p style='display:inline; color: brown'>${tipo}</p>`
            break;
        case "fairy":
            return `<p style='display:inline; color: pink'>${tipo}</p>`
            break;
        case "fighting":
            return `<p style='display:inline; color: firebrick'>${tipo}</p>`
            break;
        case "psychic":
            return `<p style='display:inline; color: deeppink'>${tipo}</p>`
            break;
        case "rock":
            return `<p style='display:inline; color: slategray'>${tipo}</p>`
            break;
        case "rock":
            return `<p style='display:inline; color: darkslategray'>${tipo}</p>`
            break;
        case "steel":
            return `<p style='display:inline; color: dimgray'>${tipo}</p>`
            break;
        case "ice":
            return `<p style='display:inline; color: cyan'>${tipo}</p>`
            break;
        case "dark":
            return `<p style='display:inline; color: black'>${tipo}</p>`
            break;
        case "ghost":
            return `<p style='display:inline; color: blueviolet'>${tipo}</p>`
            break;
        case "dragon":
            return `<p style='display:inline; color: royalblue'>${tipo}</p>`
            break;
            
    
        default:
            return `<p style='display:inline;'>${tipo}</p>`
            break;
    }
}
