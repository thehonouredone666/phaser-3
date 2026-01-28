// Rush of Fate - Menu System
// Handles all menu interactions for title, settings, win/lose screens

document.addEventListener('DOMContentLoaded', () => {
  
  // Get all screen elements
  const titlescreen = document.getElementById('titlescreen');
  const settingscreen = document.getElementById('settingscreen');
  const winscreen = document.getElementById('winscreen');
  const losescreen = document.getElementById('losescreen');
  
  // Settings button - shows settings screen
  document.getElementById('settingsButton').addEventListener('click', () => {
    settingscreen.style.display = 'block';
    titlescreen.style.display = 'none';
  });
  
  // Back button - returns to title screen
  document.getElementById('backButton').addEventListener('click', () => {
    settingscreen.style.display = 'none';
    titlescreen.style.display = 'block';
  });
  
  // Quit button - closes window
  document.getElementById('quitButton').addEventListener('click', () => {
    // Note: window.close() only works if window was opened by script
    // For local testing, show alert instead
    if (confirm('Are you sure you want to quit?')) {
      window.close();
      // Fallback if close doesn't work
      window.location.href = 'about:blank';
    }
  });
  
  // DEBUG BUTTONS (remove these in production)
  document.getElementById('loseButton').addEventListener('click', () => {
    losescreen.style.display = 'block';
    titlescreen.style.display = 'none';
  });
  
  document.getElementById('winButton').addEventListener('click', () => {
    winscreen.style.display = 'block';
    titlescreen.style.display = 'none';
  });
  
  document.getElementById('winBackButton').addEventListener('click', () => {
    winscreen.style.display = 'none';
    titlescreen.style.display = 'block';
  });

  document.getElementById('loseBackButton').addEventListener('click', () => {
    losescreen.style.display = 'none';
    titlescreen.style.display = 'block';
  });
  
  // Load saved settings from localStorage
  loadSettings();
  
  // Save settings when changed
  document.getElementById('volume').addEventListener('input', saveSettings);
  document.getElementById('difficulty').addEventListener('change', saveSettings);
});

// Save settings to localStorage
function saveSettings() {
  const volume = document.getElementById('volume').value;
  const difficulty = document.getElementById('difficulty').value;
  
  localStorage.setItem('gameVolume', volume);
  localStorage.setItem('gameDifficulty', difficulty);
  
  console.log('Settings saved:', { volume, difficulty });
}

// Load settings from localStorage
function loadSettings() {
  const savedVolume = localStorage.getItem('gameVolume');
  const savedDifficulty = localStorage.getItem('gameDifficulty');
  
  if (savedVolume) {
    document.getElementById('volume').value = savedVolume;
  }
  
  if (savedDifficulty) {
    document.getElementById('difficulty').value = savedDifficulty;
  }
}

// Function to trigger win screen (call from game)
function showWinScreen() {
  window.location.href = 'index.html?screen=win';
}

// Function to trigger lose screen (call from game)
function showLoseScreen() {
  window.location.href = 'index.html?screen=lose';
}

// Check URL parameters on load
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  
  if (screen === 'win') {
    document.getElementById('titlescreen').style.display = 'none';
    document.getElementById('winscreen').style.display = 'block';
  } else if (screen === 'lose') {
    document.getElementById('titlescreen').style.display = 'none';
    document.getElementById('losescreen').style.display = 'block';
  }
});