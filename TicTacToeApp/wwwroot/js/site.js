document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restartBtn");
    const resetScoresBtn = document.getElementById("resetScoresBtn");
    const nextGameBtn = document.getElementById("nextGameBtn"); // New button
    const modeSelect = document.getElementById("modeSelect"); // Game mode selection

    const xWinsDisplay = document.getElementById("xWins");
    const oWinsDisplay = document.getElementById("oWins");
    const drawsDisplay = document.getElementById("draws");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let xWins = 0, oWins = 0, draws = 0;
    let isMultiplayer = false; // Default mode is AI

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner() {
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                status.innerText = `${currentPlayer} Wins! 🎉`;
                gameActive = false;
                nextGameBtn.style.display = "block"; // Show "Next Game" button
                if (currentPlayer === "X") xWins++;
                else oWins++;
                updateScore();
                return;
            }
        }
        if (!board.includes("")) {
            status.innerText = "It's a Draw! 🤝";
            gameActive = false;
            nextGameBtn.style.display = "block"; // Show "Next Game" button
            draws++;
            updateScore();
        }
    }

    function updateScore() {
        xWinsDisplay.innerText = xWins;
        oWinsDisplay.innerText = oWins;
        drawsDisplay.innerText = draws;
    }

    function handleClick(event) {
        if (!gameActive) return;

        const index = event.target.dataset.index;
        if (board[index]) return;

        board[index] = currentPlayer;
        event.target.innerText = currentPlayer;

        checkWinner();

        if (gameActive) {
            if (isMultiplayer) {
                // Switch player in multiplayer mode
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                status.innerText = `Player ${currentPlayer}'s Turn`;
            } else if (currentPlayer === "X") {
                // AI Mode: AI plays after player
                currentPlayer = "O";
                status.innerText = "AI is thinking...";
                setTimeout(aiMove, 500);
            }
        }
    }

    function aiMove() {
        let available = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);
        if (available.length === 0) return;

        let randomIndex = available[Math.floor(Math.random() * available.length)];
        board[randomIndex] = "O";
        cells[randomIndex].innerText = "O";

        checkWinner();
        if (gameActive) {
            currentPlayer = "X";
            status.innerText = "Your Turn";
        }
    }

    function restartGame() {
        board.fill("");
        gameActive = true;
        currentPlayer = "X";
        status.innerText = "Player X's Turn";
        cells.forEach(cell => cell.innerText = "");
        nextGameBtn.style.display = "none"; // Hide "Next Game" button
    }

    function resetScores() {
        xWins = 0;
        oWins = 0;
        draws = 0;
        updateScore();
        restartGame();
    }

    function changeMode() {
        isMultiplayer = modeSelect.value === "multiplayer";
        restartGame();
    }

    modeSelect.addEventListener("change", changeMode);
    cells.forEach(cell => cell.addEventListener("click", handleClick));
    restartBtn.addEventListener("click", restartGame);
    resetScoresBtn.addEventListener("click", resetScores);
    nextGameBtn.addEventListener("click", restartGame); // "Next Game" button event
});
