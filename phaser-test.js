(function () {

var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#009900',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player, player2, ball;
var textX, textY, textBx, textBy, textSh;
var k_up, k_down, k_left, k_right, k_speed, k_push;
var sense = 100, step = 6, grow = 20;
var shift = 1.6, shiftCapasity = 1, isShift = false;
var impactX = 0, impactY = 0, impactBx = 0, impactBy = 0;
var ballSpeed = 2, pushSpeed = 2, ballGrow = 2, maxBallSpeed = 400;

function preload ()
{
    this.load.setBaseURL('http://localhost/canvas/image/');

    this.load.image('p1', 'p1.png');
    this.load.image('p2', 'p2.png');
    this.load.image('ball', 'ball.png');
}

function create ()
{
    this.physics.world.setBounds(0, 0, 900, 600);
    
    // k_up =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    // k_down =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON);
    // k_left =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    // k_right =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.QUOTES);
    // k_speed =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    // k_push =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    
    k_up =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    k_down =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    k_left =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    k_right =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    k_speed =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    k_push =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    player = this.physics.add
        .sprite(400, 100, 'p1')
        .setCircle(32)
        .setImmovable()
        .setCollideWorldBounds(true);

    ball = this.physics.add
        .sprite(400, 200, 'ball')
        .setCircle(16)
        .setImmovable()
        .setCollideWorldBounds(true);

    player2 = this.physics.add
        .sprite(200, 200, 'p2')
        .setCircle(32)
        .setImmovable()
        .setCollideWorldBounds(true);

    this.physics.add.overlap(player, ball, ballCollision, null, this);

    textX = this.add.text(10, 10, 'impactX : 0', { font: '14px Courier', fill: '#ffffff' });
    textY = this.add.text(10, 25, 'impactY : 0', { font: '14px Courier', fill: '#ffffff' });
    textBx = this.add.text(10, 40, 'impactBx: 0', { font: '14px Courier', fill: '#ffffff' });
    textBy = this.add.text(10, 55, 'impactBy: 0', { font: '14px Courier', fill: '#ffffff' });
    textSh = this.add.text(10, 70, 'shift   : 0', { font: '14px Courier', fill: '#ffffff' });    
}

function update ()
{
    player.setVelocity(0);
    moveX();
    moveY();

    moveBall();

    drawImpact();
}

function moveX()
{
    if (k_left.isDown)
    {
        impactX = impactX < -sense ? -sense : impactX - grow;
    }

    if (k_right.isDown)
    {
        impactX = impactX > sense ? sense : impactX + grow;
    }

    impactX = impactX > 0 
        ? (impactX < step ? 0 : impactX - step) 
        : (impactX > step * -1 ? 0 : impactX + step);

    if (k_speed.isDown && shiftCapasity > 0)
    {
        player.setVelocityX(impactX * shift);
    }
    else
    {
        player.setVelocityX(impactX);
    }
}

function moveY()
{
    if (k_up.isDown)
    {
        impactY = impactY < -sense ? -sense : impactY - grow;
    }

    if (k_down.isDown)
    {
        impactY = impactY > sense ? sense : impactY + grow;
    }

    impactY = impactY > 0 
        ? (impactY < step ? 0 : impactY - step) 
        : (impactY > step * -1 ? 0 : impactY + step);

    if (k_speed.isDown && shiftCapasity > 0)
    {
        player.setVelocityY(impactY * shift);
    }
    else
    {
        player.setVelocityY(impactY);
    }
}

function ballCollision(player, ball)
{
    var xDiff = ball.x - player.x;
    var yDiff = ball.y - player.y;
    var xIsPositive = xDiff >= 0;
    var yIsPositive = yDiff >= 0;
    var max = Math.max(Math.abs(xDiff), Math.abs(yDiff));
    var x = 100 / max * xDiff;
    var y = 100 / max * yDiff;
    impactBx = x * ballSpeed * (k_push.isDown ? pushSpeed : 1);
    impactBy = y * ballSpeed * (k_push.isDown ? pushSpeed : 1);
    
    if (impactBx > maxBallSpeed)
    {
        impactBx = maxBallSpeed;
    }
    else if (impactBx < maxBallSpeed * -1)
    {
        impactBx < maxBallSpeed * -1
    }

    if (impactBy > maxBallSpeed)
    {
        impactBy = maxBallSpeed;
    }
    else if (impactBy < maxBallSpeed * -1)
    {
        impactBy < maxBallSpeed * -1
    }
}

function moveBall()
{
    if (ball.y + 16 >= config.height || ball.y - 16 <= 0)
    {
        impactBy *= -1;
    }
    if (ball.x + 16 >= config.width || ball.x - 16 <= 0)
    {
        impactBx *= -1;
    }

    ball.setVelocity(impactBx, impactBy);
    
    if (impactBx !== 0)
    {
        impactBx = Math.floor(impactBx > 0 ? impactBx - ballGrow : impactBx + ballGrow);
    }

    if (impactBy !== 0)
    {
        impactBy = Math.floor(impactBy > 0 ? impactBy - ballGrow : impactBy + ballGrow);
    }
}

function drawImpact()
{
    textX.setText('impactX : ' + impactX);
    textY.setText('impactY : ' + impactY);
    textBx.setText('impactBx: ' + impactBx);
    textBy.setText('impactBy: ' + impactBy);
    textSh.setText('shift   : ' + shiftCapasity);
}

}());