const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display')
};
const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display')
};

const resetButton = document.querySelector('#resetButton');
const winningScoreSelect = document.querySelector('#playTo');
const winnerMessage = document.querySelector('#winnerMessage');

// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//WINNING SCORE 
let winningScore = 3;
let isGameOver = false;
let fireworksRunning = false;
let fireworksLoopId;

function updateScore(player, opponent, playerName) {
    if (!isGameOver) {
        player.score += 1;
        if (player.score === winningScore) {
            isGameOver = true;
            player.display.classList.add('has-text-success');
            opponent.display.classList.add('has-text-danger');
            player.button.disabled = true;
            opponent.button.disabled = true;
            startFireworks(); // Call the fireworks function
            showWinnerMessage(playerName);
        }
        player.display.textContent = player.score;
    }
}

function showWinnerMessage(playerName) {
    winnerMessage.innerHTML = `
      <div class="card">
        <div class="card-content">
          <div class="content">
            Congratulations! ${playerName} wins!
          </div>
        </div>
      </div>
    `;
}

p1.button.addEventListener('click', () => {
    updateScore(p1, p2, "Player One");
});

p2.button.addEventListener('click', () => {
    updateScore(p2, p1, "Player Two");
});

winningScoreSelect.addEventListener('change', function () {
    winningScore = parseInt(this.value);
    reset();
});

resetButton.addEventListener('click', reset);

function reset() {
    isGameOver = false;
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger');
        p.button.disabled = false;
    }
    winnerMessage.innerHTML = ''; // Clear the winner message
    clearCanvas(); // Clear the canvas
    stopFireworks(); // Stop the fireworks
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startFireworks() {
    fireworksRunning = true;
    initFireworks();
}

function stopFireworks() {
    fireworksRunning = false;
    cancelAnimationFrame(fireworksLoopId);
}

// Fireworks code encapsulated in a function
function initFireworks() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var fireworks = [],
        particles = [],
        hue = 120,
        limiterTotal = 5,
        limiterTick = 0,
        timerTotal = 80,
        timerTick = 0,
        mousedown = false,
        mx,
        my;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function calculateDistance(p1x, p1y, p2x, p2y) {
        var xDistance = p1x - p2x,
            yDistance = p1y - p2y;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    function Firework(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = random(50, 70);
        this.targetRadius = 1;
    }

    Firework.prototype.update = function(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        var vx = Math.cos(this.angle) * this.speed,
            vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.tx, this.ty);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    Firework.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(hue - 50, hue + 50);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
    }

    Particle.prototype.update = function(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        ctx.stroke();
    }

    function createParticles(x, y) {
        var particleCount = 30;
        while (particleCount--) {
            particles.push(new Particle(x, y));
        }
    }

    function loop() {
        if (!fireworksRunning) return; // Stop the loop if fireworksRunning is false

        fireworksLoopId = requestAnimFrame(loop);

        hue = random(0, 360);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        var i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        var i = particles.length;
        while (i--) {
            particles[i].draw();
            particles[i].update(i);
        }

        if (timerTick >= timerTotal) {
            if (!mousedown) {
                fireworks.push(new Firework(canvas.width / 2, canvas.height, random(0, canvas.width), random(0, canvas.height / 2)));
                timerTick = 0;
            }
        } else {
            timerTick++;
        }

        if (limiterTick >= limiterTotal) {
            if (mousedown) {
                fireworks.push(new Firework(canvas.width / 2, canvas.height, mx, my));
                limiterTick = 0;
            }
        } else {
            limiterTick++;
        }
    }

    canvas.addEventListener('mousemove', function(e) {
        mx = e.pageX - canvas.offsetLeft;
        my = e.pageY - canvas.offsetTop;
    });

    canvas.addEventListener('mousedown', function(e) {
        e.preventDefault();
        mousedown = true;
    });

    canvas.addEventListener('mouseup', function(e) {
        e.preventDefault();
        mousedown = false;
    });

    loop();
}

