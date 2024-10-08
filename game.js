const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game Variables
let player;
let platforms = [];
let keys = {};
let gravity = 0.5;
let score = 0;

// Player Constructor
function Player() {
    this.x = canvas.width / 2 - 15;
    this.y = canvas.height / 2;
    this.width = 30;
    this.height = 30;
    this.dy = 0; // vertical speed
}

// Draw Player
Player.prototype.draw = function() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Update Player
Player.prototype.update = function() {
    this.dy += gravity;
    this.y += this.dy;

    // Jumping
    if (keys["ArrowUp"] && this.dy > 0) {
        this.dy = -10; // jump speed
    }

    // Boundary checks
    if (this.y > canvas.height) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }

    // floor collision
    if (this.y < 0) this.y = 0;
    if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
};

// Platform Constructor
function Platform(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 10;
}

// Draw Platform
Platform.prototype.draw = function() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Check Collisions
function checkCollision() {
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y &&
            player.y + player.height + player.dy > platform.y
        ) {
            player.dy = 0; // stop falling
            player.y = platform.y - player.height; // place player on the platform
            score++;
        }
    });
}

// Create Initial Platforms
function createPlatforms() {
    for(let i = 0; i < 5; i++) {
        platforms.push(new Platform(Math.random() * (canvas.width - 60), i * 120 + 100, 60));
    }
}

// Draw Score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Reset Game
function resetGame() {
    player = new Player();
    platforms = [];
    score = 0;
    createPlatforms();
}

// Key Event Listeners
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update();
    player.draw();
    
    checkCollision();
    
    platforms.forEach(platform => platform.draw());

    drawScore();
    
    requestAnimationFrame(gameLoop);
}

// Start Game
resetGame();
gameLoop();
