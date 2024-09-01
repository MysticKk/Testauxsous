let score = 0;
let malus = 0;
let gameActive = false;
let timer = 30; // Game duration in seconds
let targetInterval;
let countdownInterval;
let currentLevel = 1;

// Function to start the game
function startGame(level) {
    if (gameActive) return; // Prevent restarting if the game is active

    score = 0;
    malus = 0;
    timer = 30;
    gameActive = true;
    currentLevel = level;
    document.getElementById('score').innerText = score;
    document.getElementById('malus').innerText = malus;
    document.getElementById('timer').innerText = timer;
    document.getElementById('start-button').disabled = true; // Disable level 1 start button
    document.getElementById('start-level2-button').disabled = true; // Disable level 2 start button

    let spawnRate = level === 1 ? 1000 : 500; // Faster spawn rate for Level 2
    let targetLifetime = level === 1 ? 2000 : 1000; // Shorter lifetime for Level 2

    targetInterval = setInterval(() => spawnTarget(targetLifetime), spawnRate); // Adjust spawning for level
    countdownInterval = setInterval(updateTimer, 1000); // Update timer every second
}

// Function to spawn a target
function spawnTarget(lifetime) {
    if (!gameActive) return; // Stop spawning if the game is not active

    const playArea = document.getElementById('play-area');
    const target = document.createElement('div');
    target.classList.add('target');

    // Set random position for the target within the play area
    const size = playArea.getBoundingClientRect();
    const maxX = size.width - 50; // 50 is the target width
    const maxY = size.height - 50; // 50 is the target height
    target.style.left = Math.random() * maxX + 'px';
    target.style.top = Math.random() * maxY + 'px';

    // Additional movement for targets in Level 2
    if (currentLevel === 2) {
        let moveInterval = setInterval(() => moveTarget(target, maxX, maxY), 300);
        setTimeout(() => clearInterval(moveInterval), lifetime); // Stop moving after lifetime
    }

    target.onclick = (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to play area
        score++;
        document.getElementById('score').innerText = score;
        target.remove();
    };

    playArea.appendChild(target);

    // Remove target after a specific lifetime if not clicked
    setTimeout(() => {
        if (playArea.contains(target)) {
            target.remove();
            score--; // Penalize for missing the target
            document.getElementById('score').innerText = score;
        }
    }, lifetime);
}

// Function to move target randomly
function moveTarget(target, maxX, maxY) {
    target.style.left = Math.random() * maxX + 'px';
    target.style.top = Math.random() * maxY + 'px';
}

// Function to handle missed clicks
function increaseMalus(event) {
    if (event.target.className !== 'target' && gameActive) {
        malus++;
        document.getElementById('malus').innerText = malus;
    }
}

// Function to update the timer
function updateTimer() {
    timer--;
    document.getElementById('timer').innerText = timer;
    if (timer <= 0) endGame();
}

// Function to end the game
function endGame() {
    gameActive = false;
    clearInterval(targetInterval);
    clearInterval(countdownInterval);
    document.getElementById('start-button').disabled = false; // Re-enable start button for Level 1
    document.getElementById('start-level2-button').disabled = false; // Re-enable start button for Level 2

    // Remove any remaining targets
    const playArea = document.getElementById('play-area');
    playArea.innerHTML = '';

    alert('Game over! Your final score is: ' + score + '\nMalus points: ' + malus);
}
