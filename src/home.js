import burgerImage from "./assets/burger.jpg";

export function loadHome() {
    const content = document.querySelector("#content");
    const fragment = document.createDocumentFragment();

    const h2 = document.createElement("h2");
    h2.innerText = "Food so good, you'll wish it were real";
    fragment.appendChild(h2);

    const p = document.createElement("p");
    p.innerHTML = 
        "Come down to try the best food around town when you're feelin " +
        "like a Starvin' Marvin! <br>" +
        "Try one of our famous mealio dealios and experience true cuisine.";
    fragment.appendChild(p);

    const img = document.createElement("img");
    img.src = burgerImage
    img.alt = "burgerImage";
    img.width = "600";
    fragment.appendChild(img);

    content.appendChild(fragment);
}


    