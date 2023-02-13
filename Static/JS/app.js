let template = document.querySelector("#plantilla-plato")
let menu = document.querySelector("section#platos div")
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

fetch('https://63d011d710982404378c822f.mockapi.io/carta')
  .then(response => response.json())
  .then(data => {

    carta = data;
    mostrarCarta();
    let botones = document.querySelectorAll("button");
botones.forEach(boton => {
  boton.addEventListener("click", function () {

    let platito = this.closest("div");

    let platitoFavorito = {
      image: platito.querySelector("img").src,
      plato: platito.querySelector("h4").innerHTML,
      ingredientes: platito.querySelector(".ingredientes").innerHTML,
      precio: platito.querySelector(".precio").innerHTML,
      alergenos: platito.querySelector(".alergenos").innerHTML
    };

    let existe = favoritos.findIndex(p => p.plato === platitoFavorito.plato)
    if (existe === -1) {
      favoritos.push(platitoFavorito);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  });
});

let mostrarFav = false;
document.querySelector("#mostrarFavoritos").addEventListener("click", function() {
  mostrarFav = !mostrarFav;
  if (mostrarFav) {
    favoritos.forEach(function(plato) {
      // Construir el template
      const row = document.createElement("tr");
      row.innerHTML = `<td> 
                  <img src="${plato.image}" width=100> 
                 </td>
                 <td>${plato.plato}</td>
                 <td>
                  <a href="#" class="borrar-curso" data-id="${plato.id}"> ❌</a>
                 </td>`;
      document.querySelector("#lista-carrito tbody").appendChild(row);
    });
    document.querySelector("tbody").addEventListener("click", function(e) {
      if (e.target.classList.contains("borrar-curso")) {
        e.target.parentElement.parentElement.remove();

        const id = e.target.getAttribute("data-id");
        const updatedFavoritos = favoritos.filter(plato => plato.id !== id);
        favoritos = updatedFavoritos;
        if (favoritos.length) {
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
        } else {
          localStorage.removeItem("favoritos");
        }
      }
    });
  } else {
    document.querySelector("tbody").innerHTML = "";
  }
});

document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("borrar-curso")) {
    e.target.parentElement.parentElement.remove();

    // Borra elemento del local
    const id = e.target.getAttribute("data-id");
    const index = favoritos.findIndex(plato => plato.id === id);
    favoritos.splice(index, 1);

    // Actualizar el local storage 
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
});

    
  });


//Mostrar carta con filtros
function mostrarCarta() {
  const celiaco = document.getElementById("celiaco").checked;
  const sinLactosa = document.getElementById("sinlactosa").checked;
  const vegetariano = document.getElementById("vegetariano").checked;

  const platos = carta.filter(plato => {

    if (celiaco && !plato.celiaco) return false;
    if (sinLactosa && !plato.sinlactosa) return false;
    if (vegetariano && !plato.vegetariano) return false;

    return true;
  });

  const menu = document.querySelector("section#platos div");
  // console.log(menu)
  menu.innerHTML = "";
  platos.forEach(plato => {
    const clon = document.importNode(template.content, true);
    clon.querySelector("img").src = plato.image;
    clon.querySelector("h4").innerHTML = plato.plato;
    clon.querySelector(".ingredientes").innerHTML = plato.ingredientes;
    clon.querySelector(".precio").innerHTML = plato.precio;
    clon.querySelector(".alergenos").innerHTML = plato.alergenos;
    menu.appendChild(clon);
  });
}

//Borra favoritos
function borrarFavoritos() {
  favoritos = []
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

//Filtro por precio

let order = 'desc';

document.querySelector('#sort').addEventListener('click', function () {
  if (order === 'desc') {
    order = 'asc';
  } else {
    order = 'desc';
  }

  let menu = document.querySelector("section#platos div");
  let items = Array.from(menu.children);

  items.sort(function (a, b) {
    let aPrice = parseInt(a.querySelector('p.precio').textContent);
    let bPrice = parseInt(b.querySelector('p.precio').textContent);

    if (order === 'asc') {
      return aPrice - bPrice;
    } else {
      return bPrice - aPrice;
    }
  });

  menu.innerHTML = '';
  menu.append(...items);
});


var store = window.localStorage;
document.getElementById("filter").addEventListener("click", mostrarCarta);

function initStorage() {

  if (store.getItem("favoritos") == null) {
    store.setItem("favoritos", JSON.stringify(favoritos));
  }
  favoritos = JSON.parse(store.getItem("favoritos"));

  console.table(favoritos)

}
window.addEventListener('load', (event) => {
  initStorage()

});
