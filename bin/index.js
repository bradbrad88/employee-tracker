// Use environment variables in .env file to initialise database
import "dotenv/config";
// Initialise console.table module
import "console.table";
// Import main menu function to create main loop
import mainMenu from "../lib/index.js";

async function init() {
  while (true) {
    await mainMenu();
  }
}

init();
