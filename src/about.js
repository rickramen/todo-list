export function loadAbout() {
    const content = document.querySelector("#content");
    const fragment = document.createDocumentFragment();

    const h2 = document.createElement("h2");
    h2.innerText = "About Us";
    fragment.appendChild(h2);

    const p = document.createElement("p");
    p.innerHTML = 
        "This restaurant was founded by very cool people :) <br>" +
        "All our dishes are made fresh with the finest ingredients <br>" +
        "Stop by to experience flavor town.";
        fragment.appendChild(p);

    content.appendChild(fragment);
}