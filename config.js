// Rush of Fate - Game Configuration

const gameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  backgroundColor: '#028383',
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { y: 900 }, 
      debug: false 
    }
  },
  scene: [] // Scenes will be added in main.js
};

// Game constants - adjust these to change difficulty
const GAME_CONSTANTS = {
  PLAYER_SPEED: 220,
  JUMP_VELOCITY: -420,
  PLAYER_DRAG: 1000,
  
  BOT_PATROL: {
    minX: 320,
    maxX: 820,
    speed: 90
  },
  
  // Load difficulty from localStorage
  getDifficulty: () => {
    const difficulty = localStorage.getItem('gameDifficulty') || 'medium';
    
    switch(difficulty) {
      case 'easy':
        return {
          playerSpeed: 250,
          jumpVelocity: -450,
          botSpeed: 70
        };
      case 'hard':
        return {
          playerSpeed: 200,
          jumpVelocity: -400,
          botSpeed: 120
        };
      default: // medium
        return {
          playerSpeed: 220,
          jumpVelocity: -420,
          botSpeed: 90
        };
    }
  }
};