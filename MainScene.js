class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
    this.load.image('door', 'assets/door.jpg');

    // Generate player texture
    const g1 = this.add.graphics();
    g1.fillStyle(0x3ad97a, 1).fillRoundedRect(0, 0, 24, 36, 6);
    g1.generateTexture('playerTex', 24, 36);
    g1.destroy();

    // Generate bot texture
    const g2 = this.add.graphics();
    g2.fillStyle(0x3aa1ff, 1).fillCircle(16, 16, 16);
    g2.generateTexture('botTex', 32, 32);
    g2.destroy();

    // Generate tile texture
    const g3 = this.add.graphics();
    g3.fillStyle(0x4b5c6b, 1).fillRect(0, 0, 48, 24);
    g3.generateTexture('tile', 48, 24);
    g3.destroy();
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    
    // Apply difficulty settings
    const difficulty = window.gameState.currentDifficulty;
    
    // Background
    this.add.image(W/2, H/2, 'sky').setScale(2);
    
    // Ground
    this.ground = this.physics.add.staticGroup();
    for (let x = 0; x < W; x += 48) {
      this.ground.create(x + 24, H - 20, 'tile').refreshBody();
    }

    // Hill
    this.createHill();
    
    // Door
    this.createDoor();
    
    // Player
    this.createPlayer();
    
    // Bot (with difficulty-adjusted speed)
    this.createBot(difficulty.botSpeed);
    
    // Collisions
    this.setupCollisions();
    
    // UI Elements
    this.createUI();
    
    // Controls
    this.setupControls();
    
    // Camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, W, H);
  }

  createHill() {
    const H = this.scale.height;
    this.hill = this.physics.add.staticGroup();
    
    let x = 320;
    // Create hill platforms
    for (let i = 0; i < 1; i++) {
      this.hill.create(x, 900, 'tile').refreshBody(); x += 400;
      this.hill.create(x, 860, 'tile').refreshBody(); x += 400;
      this.hill.create(x, 800, 'tile').refreshBody(); x += 400;
    }
    
    // Create flat top section
    for (let j = 0; j < 10; j++) {
      this.hill.create(x, 800, 'tile').refreshBody();
      x += 40;
    }
  }

  createDoor() {
    const H = this.scale.height;
    const baseY = H - 56;
    
    this.door = this.add.image(1650, baseY - 335, 'door').setScale(0.47);
    this.physics.add.existing(this.door, true);
    this.touchingDoor = false;
    
    // Door prompt
    this.doorPrompt = this.add.text(0, 0, 'SPACE to enter', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#1a2733',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setAlpha(0).setDepth(1000);
  }

  createPlayer() {
    const H = this.scale.height;
    const baseY = H - 56;
    const difficulty = window.gameState.currentDifficulty;
    
    this.player = this.physics.add.sprite(80, baseY - 80, 'playerTex');
    this.player.setCollideWorldBounds(true);
    this.player.setDragX(GAME_CONSTANTS.PLAYER_DRAG);
    
    // Store player stats
    this.playerSpeed = difficulty.playerSpeed;
    this.jumpVelocity = difficulty.jumpVelocity;
    this.canDoubleJump = false;
  }

  createBot(botSpeed) {
    const H = this.scale.height;
    const baseY = H - 56;
    const patrol = GAME_CONSTANTS.BOT_PATROL;
    
    this.bot = this.physics.add.sprite(
      (patrol.minX + patrol.maxX) / 2, 
      baseY - 200, 
      'botTex'
    );
    this.bot.setVelocityX(botSpeed);
    this.botSpeed = botSpeed; // Store for later use
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.hill);
    this.physics.add.collider(this.bot, this.ground);
    this.physics.add.collider(this.bot, this.hill);
    
    // Door overlap
    this.physics.add.overlap(this.player, this.door, () => {
      this.touchingDoor = true;
    });
  }

  createUI() {
    const W = this.scale.width;
    
    // Bot talk prompt
    this.nearPrompt = this.add.text(0, 0, 'SPACE to talk', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#1a2733',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setAlpha(0).setDepth(1000);

    // Dialog box
    this.dialogGroup = this.add.container(W / 2, 120)
      .setDepth(1500)
      .setVisible(false);
      
    this.dialogGroup.add([
      this.add.rectangle(0, 0, 420, 130, 0x0f1822, 0.96)
        .setStrokeStyle(2, 0x3aa1ff)
        .setOrigin(0.5),
      this.add.text(0, -26, '🤖 Bot: What do you want?', {
        fontSize: '20px',
        color: '#fff'
      }).setOrigin(0.5),
      this.add.text(0, 12, 'SPACE: Continue • ESC: Cancel', {
        fontSize: '16px',
        color: '#b7c9d3'
      }).setOrigin(0.5)
    ]);
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // ESC key handler
    this.escKey.on('down', () => {
      if (window.gameState.dialogOpen) {
        this.closeDialog();
        return;
      }
      if (window.gameState.settingsOpen) {
        closeSettings();
      } else {
        openSettings();
      }
    });

    // SPACE key handler
    this.jumpKey.on('down', () => {
      // Bot interaction
      if (this.isCloseToBot() && !window.gameState.dialogOpen && !window.gameState.settingsOpen) {
        this.openDialog();
        return;
      }

      // Close dialog
      if (window.gameState.dialogOpen) {
        this.closeDialog();
        return;
      }

      // Door interaction happens in update()
    });
  }

  update() {
    // Door interaction
    const standingAtDoor = this.touchingDoor;
    this.touchingDoor = false;

    if (standingAtDoor && !window.gameState.dialogOpen && !window.gameState.settingsOpen) {
      this.doorPrompt
        .setPosition(this.door.x, this.door.y - 100)
        .setOrigin(0.5)
        .setAlpha(1);

      if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
        this.scene.start('Scene2');
        return;
      }
    } else {
      this.doorPrompt.setAlpha(0);
    }

    // Movement and jumping
    this.handleMovement();
    
    // Bot patrol
    this.handleBotPatrol();
    
    // Bot talk prompt
    this.handleBotPrompt();
  }

  handleMovement() {
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    if (onGround) this.canDoubleJump = true;

    if (window.gameState.canMove) {
      if (this.cursors.left.isDown || this.aKey.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
      } else if (this.cursors.right.isDown || this.dKey.isDown) {
        this.player.setVelocityX(this.playerSpeed);
      } else {
        this.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
        if (onGround) {
          this.player.setVelocityY(this.jumpVelocity);
        } else if (this.canDoubleJump) {
          this.player.setVelocityY(this.jumpVelocity);
          this.canDoubleJump = false;
        }
      }
    } else {
      this.player.setVelocityX(0);
    }
  }

  handleBotPatrol() {
    if (!window.gameState.dialogOpen && !window.gameState.settingsOpen) {
      const patrol = GAME_CONSTANTS.BOT_PATROL;
      if (this.bot.x <= patrol.minX) this.bot.setVelocityX(this.botSpeed);
      if (this.bot.x >= patrol.maxX) this.bot.setVelocityX(-this.botSpeed);
      this.bot.rotation += this.bot.body.velocity.x * 0.0008;
    } else {
      this.bot.setVelocityX(0);
    }
  }

  handleBotPrompt() {
    if (!window.gameState.dialogOpen && !window.gameState.settingsOpen && this.isCloseToBot()) {
      this.nearPrompt.setPosition(this.bot.x, this.bot.y - 50).setAlpha(1);
    } else {
      this.nearPrompt.setAlpha(0);
    }
  }

  isCloseToBot() {
    return Math.abs(this.player.x - this.bot.x) < 40 &&
           Math.abs(this.player.y - this.bot.y) < 60;
  }

  openDialog() {
    window.gameState.canMove = false;
    window.gameState.dialogOpen = true;
    this.dialogGroup.setVisible(true);
  }

  closeDialog() {
    window.gameState.dialogOpen = false;
    this.dialogGroup.setVisible(false);
    window.gameState.canMove = true;
  }
}