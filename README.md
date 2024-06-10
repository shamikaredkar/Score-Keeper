# Score-Keeper
![ScoreKeeper Preview](https://github.com/shamikaredkar/Score-Keeper/blob/main/PreviewImage.png)

# Score Keeper App

## Purpose
The Score Keeper App is a simple web application that allows users to track scores for two players, set a winning score, and reset the game. It displays a congratulatory message and fireworks when a player wins.

## Features
- Add points to Player One
- Add points to Player Two
- Set the winning score limit
- Reset the game
- Display congratulatory message with fireworks when a player wins

## Usage
1. Click "+1 Player One" to add a point to Player One.
2. Click "+1 Player Two" to add a point to Player Two.
3. Use the dropdown to set the winning score limit.
4. Click "Reset" to reset the game.

## Code Structure

### HTML
- `index.html`: The main HTML file that includes the structure of the app.

### CSS
- Inline CSS: Styles the main components of the app and includes the canvas for fireworks.

### JavaScript
- `app.js`: Handles the functionality of the app, including score updates, winning logic, and fireworks animation.

### Bulma
The Score Keeper App uses Bulma, a modern CSS framework, for styling the components. Bulma provides a clean and responsive design with minimal effort, ensuring the app looks great on all devices.

## How It Works

### HTML
The main container of the app is a div with the class `container`, which includes buttons for adding points, selecting the winning score, and resetting the game. Below the container, a canvas element is used for the fireworks animation, and a div is used to display the congratulatory message.

### CSS
The CSS styles the body, the main container, the score displays, the buttons, the canvas for fireworks, and the congratulatory message. It uses a fixed position for the canvas to ensure it covers the entire screen during the fireworks animation.

### JavaScript
The JavaScript file includes the following main functions:

- `updateScore(player, opponent, playerName)`: Updates the score for the specified player and checks for a win.
- `showWinnerMessage(playerName)`: Displays a congratulatory message with the winner's name.
- `reset()`: Resets the game, clearing scores, messages, and stopping the fireworks.
- `clearCanvas()`: Clears the canvas used for the fireworks animation.
- `startFireworks()`: Initiates the fireworks animation.
- `stopFireworks()`: Stops the fireworks animation.
- `initFireworks()`: Contains the fireworks animation logic, managing fireworks and particles.

### Event Listeners
- The `p1Button` and `p2Button` elements have event listeners for the click event to add points to Player One and Player Two, respectively.
- The `winningScoreSelect` element has an event listener for the change event to update the winning score limit.
- The `resetButton` element has an event listener for the click event to reset the game.
