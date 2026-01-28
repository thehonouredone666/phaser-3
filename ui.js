// Rush of Fate - Pause Menu UI

function openSettings() {
  window.gameState.settingsOpen = true;
  window.gameState.canMove = false;
  document.getElementById('escapescreen').style.display = 'flex';
}

function closeSettings() {
  window.gameState.settingsOpen = false;
  window.gameState.canMove = true;
  document.getElementById('escapescreen').style.display = 'none';
}

// Setup button listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resumeButton').onclick = closeSettings;
  
  document.getElementById('mainMenuButton').onclick = () => {
    closeSettings();
    // Return to title screen
    window.location.href = 'index.html';
  };
  
  // Settings button doesn't do anything yet, but could open in-game settings
  document.getElementById('escSettingsButton').onclick = () => {
    alert('In-game settings coming soon!');
  };
});