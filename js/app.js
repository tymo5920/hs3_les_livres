const API = (() => {
  const BASE_PATH = "https://inventaire.io/api";
  const USER_ID = "6a65aa87e68e161650bf7741ad001249"; //hs3 account

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

document.addEventListener("DOMContentLoaded", async () => {
  if (!('content' in document.createElement('template'))) {
    alert("You need to update your browser in order to view this page!")
  }

  console.log(await API.listShelves())

})
