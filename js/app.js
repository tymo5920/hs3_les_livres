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
    listShelves() {
      return myFetch(`${BASE_PATH}/shelves?action=by-owners&owners=${USER_ID}`)
        .then(response => response.json())
    },
    listBooks(offset = null) {
      const paramsDefinition = {
        action: 'by-users',
        users: USER_ID,
        offset
      }

      const params = new URLSearchParams();
      for (const name in paramsDefinition) {
        const value = paramsDefinition[name];
        if (value != null)
          params.append(name, value);
      }

      return myFetch(`${BASE_PATH}/items?${params.toString()}`)
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

const renderBook = (book) => {
  const { _id, snapshot: details } = book;

  const template = document.querySelector("template#tpl-book");
  const clone = template.content.cloneNode(true);

  clone.querySelector("div").id = `book-${_id}`;
  clone.querySelector(".tpl-title").innerText = details['entity:title'];
  clone.querySelector(".tpl-author").innerText = details['entity:authors'] ?? "";

  if (details['entity:image']) {
    clone.querySelector(".tpl-image").src = `https://inventaire.io${details['entity:image']}`;
    clone.querySelector(".tpl-image").alt = details['entity:title'];
  } else {
    clone.querySelector(".tpl-image").style.display = "none";
    clone.querySelector(".tpl-image-text").style.display = "block";
  }

  return clone;
}

const loadBooks = async (offset = 0) => {
  const booksData = (await API.listBooks(offset));
  let books = booksData.items;

  for (const bookID in books) {
    const book = books[bookID];
    const bookNode = renderBook(book);
    const shelfID = book.shelves[0];
    const shelfNode = document.querySelector(`#shelf-${shelfID}`);

    shelfNode.appendChild(bookNode);
  }

  // load more books if available
  if (booksData.continue != null) {
    books = [...books, await loadBooks(booksData.continue)];
  }

  return books;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!('content' in document.createElement('template'))) {
    alert("You need to update your browser in order to view this page!")
  }

  // theese variables will be useful for filtering purpouse
  const shelves = await loadShelves();
  const books = await loadBooks();
})
