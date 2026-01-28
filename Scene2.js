class Scene2 extends Phaser.Scene {
  constructor() {
    super('Scene2');
  }

  preload() {
    this.load.image('sky2', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Background
    this.add.image(W / 2, H / 2, 'sky2').setScale(2);

    // Title text
    this.add.text(W / 2, H / 2, "Welcome to Screen 2!", {
      fontSize: '48px',
      color: '#fff'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(W / 2, H / 2 + 80, "Press M to return to Main Scene", {
      fontSize: '24px',
      color: '#ddd'
    }).setOrigin(0.5);

    // Setup controls
    this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
      this.scene.start('MainScene');
    }
  }
}