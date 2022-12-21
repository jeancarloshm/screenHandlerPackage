const screens = require('./screens.json'); // import the JSON file
const fs = require('fs');

let currentScreen = 0; // initialize the current screen index to 0 (welcome screen)

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayCurrentScreen() {
  // display the current screen
  console.log(screens[currentScreen].message);

  // if the current screen is a form, prompt the user for input for each field
  const userInput = {};
  if (screens[currentScreen].type === 'form') {
  const fields = screens[currentScreen].fields;
  fields.forEach(field => {
  readline.question(`${field.label}: `, (input) => {
  userInput[field.label] = input;
  });
  });
  }
  
  fs.writeFileSync('user_input.json', JSON.stringify(userInput));

  // if the current screen is an exit screen, prompt the user to confirm exit
  if (screens[currentScreen].type === 'exit') {
    readline.question(screens[currentScreen].message, (input) => {
      if (input === 'y') {
        console.log('Exiting the program');
        readline.close();
      } else {
        // if the user does not confirm exit, go back to the previous screen
        currentScreen--;
        displayCurrentScreen();
      }
    });
  }
}

// display the first screen (welcome screen)
displayCurrentScreen();

// listen for the user's input to navigate to the next screen
readline.on('line', () => {
  currentScreen++;
  displayCurrentScreen();
});
