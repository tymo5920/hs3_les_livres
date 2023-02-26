const API = (() => {
  const BASE_PATH = "https://inventaire.io/api";
  const USER_ID = "9427574a67c4e8b2ecd6e3bfe315efbf"; //hs3 account

  const myFetch = (url, ...args) => {
    return fetch(url, {
      ...args,
      headers: {
        "Accept": "application/json"
      }
    });
  }

  return {
    async listShelves() {
      return myFetch(`${BASE_PATH}/shelves?action=by-owners&owners=${USER_ID}`)
        .then(response => response.json())
    }
  }
})()

const renderShelf = (shelf) => {
  const { name, _id } = shelf;

  const template = document.querySelector("template#tpl-shelf");
  const clone = template.content.cloneNode(true);
  clone.querySelector(".tpl-name").innerText = name;
  clone.querySelector(".tpl-content").id = `shelf-${_id}`;

  return clone;
}

const loadShelves = async () => {
  const target = document.querySelector("#target-books");
  const shelves = (await API.listShelves()).shelves

  for (const shelfID in shelves) {
    const shelf = shelves[shelfID];
    const shelfNode = renderShelf(shelf);
    target.appendChild(shelfNode);
  }

  return shelves;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!('content' in document.createElement('template'))) {
    alert("You need to update your browser in order to view this page!")
  }

  const shelves = await loadShelves();

})
