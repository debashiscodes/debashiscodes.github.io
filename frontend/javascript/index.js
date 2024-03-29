import "$styles/index.css";
import "$styles/syntax-highlighting.css";
import { Application } from "@hotwired/stimulus";

// Import all JavaScript & CSS files from src/_components
import components from "$components/**/*.{js,jsx,js.rb,css}";

console.info("Bridgetown is loaded!");

window.Stimulus = Application.start();

import controllers from "./controllers/**/*.{js,js.rb}";
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes("_controller.") || filename.includes("-controller.")) {
    const identifier = filename
      .replace("./controllers/", "")
      .replace(/[_-]controller\..*$/, "")
      .replace("_", "-")
      .replace("/", "--");

    Stimulus.register(identifier, controller.default);
  }
});

// (function () {
//   var words = ["ନମସ୍କାର", "नमस्ते", "Hello", "Hallo", "こんにちは"],
//     i = 0;
//   setInterval(function () {
//     $("#greeting").fadeOut(function () {
//       $(this)
//         .html(words[(i = (i + 1) % words.length)])
//         .fadeIn();
//     });
//   }, 3000);
// })();
