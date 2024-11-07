export function loadMenu() {
    const content = document.querySelector("#content");
    const fragment = document.createDocumentFragment();

    const h2 = document.createElement("h2");
    h2.innerText = "Our Menu";
    fragment.appendChild(h2);


    const menuList = document.createElement("ul");
    menuList.classList.add("menu");
    const menuItems = [
        { name: "Spaghetti ", price: "$9.99" },
        { name: "Pepperoni Pizza", price: "$11.99" },
        { name: "Double Cheeseburger w/ Fries", price: "$12.99" },
        { name: "Wagyu Steak", price: "$39.99" },
        { name: "Chocolate Cake", price: "$6.99" },
        { name: "Ice Cream", price: "$4.99" },
        { name: "Soda", price: "$2.99" }
    ];

    menuItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerText = `${item.name} - ${item.price}`;
        menuList.appendChild(listItem);
    });
    fragment.appendChild(menuList);

    content.appendChild(fragment);
}