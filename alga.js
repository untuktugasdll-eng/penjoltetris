const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 12;
const SIZE = 20;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

let score = 0;
let highScore = localStorage.getItem("tetrisHigh") || 0;

document.getElementById("highScore").innerText = highScore;

const pieces = [
    [
        [1, 1, 1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1]
    ]
];

let current = pieces[Math.floor(Math.random() * pieces.length)];

let x = 4;
let y = 0;

let paused = false;
let gameOver = false;

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
    ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            if (board[r][c]) {
                drawSquare(c, r, "cyan");
            }
        }
    }

    for (let r = 0; r < current.length; r++) {
        for (let c = 0; c < current[r].length; c++) {
            if (current[r][c]) {
                drawSquare(x + c, y + r, "red");
            }
        }
    }

}

function drop() {

    if (paused || gameOver) return;

    y++;

    if (collision()) {
        y--;
        merge();
        score += 10; // tambah 10 poin saat block berhenti
        updateScore();
        clearLines();
        newPiece();
    }

    draw();
}

function updateScore() {
    document.getElementById("score").innerText = score;
}

function moveLeft() {
    if (paused || gameOver) return;
    x--;
    if (collision()) x++;
    draw();
}

function moveRight() {
    if (paused || gameOver) return;
    x++;
    if (collision()) x--;
    draw();
}

function rotate() {

    if (paused || gameOver) return;

    let rotated = current[0].map((_, i) => current.map(r => r[i])).reverse();
    let old = current;

    current = rotated;

    if (collision()) current = old;

    draw();
}

function collision() {

    for (let r = 0; r < current.length; r++) {
        for (let c = 0; c < current[r].length; c++) {

            if (current[r][c]) {

                let newX = x + c;
                let newY = y + r;

                if (newX < 0 || newX >= COL || newY >= ROW) return true;
                if (board[newY] && board[newY][newX]) return true;

            }

        }
    }

    return false;
}

function merge() {

    for (let r = 0; r < current.length; r++) {
        for (let c = 0; c < current[r].length; c++) {

            if (current[r][c]) {

                if (y + r <= 0) {
                    endGame();
                    return;
                }

                board[y + r][x + c] = 1;

            }

        }
    }

}

function clearLines() {

    for (let r = ROW - 1; r >= 0; r--) {

        if (board[r].every(cell => cell)) {

            board.splice(r, 1);
            board.unshift(Array(COL).fill(0));

            score += 100; // tambah 100 poin jika garis hancur
            updateScore();

            showCoolText();
        }

    }
}

function showCoolText() {

    const text = document.getElementById("coolText");

    text.style.display = "block";

    setTimeout(() => { text.style.display = "none" }, 1000);
}

function newPiece() {
    current = pieces[Math.floor(Math.random() * pieces.length)];
    x = 4;
    y = 0;
}

function endGame() {

    gameOver = true;

    if (score > highScore) {
        localStorage.setItem("tetrisHigh", score);
    }

    document.getElementById("gameOver").style.display = "block";
}

function pauseGame() { paused = true; }

function resumeGame() { paused = false; }

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
    if (e.key === "ArrowDown") drop();
    if (e.key === "ArrowUp") rotate();
});

function toggleMenu() {
    const box = document.getElementById("creditBox");
    box.style.display = box.style.display === "block" ? "none" : "block";
}

function closeCredit() {
    document.getElementById("creditBox").style.display = "none";
}

setInterval(drop, 800);

draw();