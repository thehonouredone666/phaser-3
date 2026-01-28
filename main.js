// Rush of Fate - Game Initialization

// Register all scenes
gameConfig.scene = [MainScene, Scene2];

// Create game instance
const game = new Phaser.Game(gameConfig);

// Global game state
window.gameState = {
  canMove: true,
  dialogOpen: false,
  settingsOpen: false,
  currentDifficulty: GAME_CONSTANTS.getDifficulty()
};

// Function to end game with win
window.winGame = function() {
  game.destroy(true);
  window.location.href = 'index.html?screen=win';
};

// Function to end game with loss
window.loseGame = function() {
  game.destroy(true);
  window.location.href = 'index.html?screen=lose';
};