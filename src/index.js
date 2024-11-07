/* index.js */

import { loadHome } from "./home.js"
import { loadMenu } from "./menu.js"
import { loadAbout } from "./about.js" 
import "./styles.css";

const content = document.querySelector("#content");
let currentModule = "home";

// Default module
loadHome();

const loadModule = (module) => {
  if (currentModule === module) {
      return; 
  }
  content.innerHTML = ""; // Clear current content
  currentModule = module; // Update with new content

  switch (module) {
      case "home":
          loadHome();
          break;
      case "menu":
          loadMenu();
          break;
      case "about":
          loadAbout();
          break;
      default:
          console.error(`Module ${module} not recognized.`);
  }
};

// Button Click Event Listeners
const homeButton = document.querySelector("#home-btn");
homeButton.addEventListener("click", () => loadModule("home"));

const menuButton = document.querySelector("#menu-btn");
menuButton.addEventListener("click", () => loadModule("menu"));

const aboutButton = document.querySelector("#about-btn");
aboutButton.addEventListener("click", () => loadModule("about"));