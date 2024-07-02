document.addEventListener("DOMContentLoaded", function() {
    const rows = 10;
    const cols = 10;
    const minesCount = 20;
    let board = [];
    let mineLocations = [];
    const minesweeper = document.getElementById("minesweeper");
    const resetButton = document.getElementById("resetButton");

    function init() {
        minesweeper.innerHTML = '';
        board = [];
        mineLocations = [];
        generateBoard();
        placeMines();
        updateNumbers();
    }

    function generateBoard() {
        for (let row = 0; row < rows; row++) {
            const rowArr = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', revealCell);
                minesweeper.appendChild(cell);
                rowArr.push(cell);
            }
            board.push(rowArr);
        }
    }

    function placeMines() {
        let placedMines = 0;
        while (placedMines < minesCount) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (!mineLocations.includes(`${row},${col}`)) {
                mineLocations.push(`${row},${col}`);
                board[row][col].dataset.mine = 'true';
                placedMines++;
            }
        }
    }

    function updateNumbers() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (!board[row][col].dataset.mine) {
                    let mines = 0;
                    directions.forEach(([dx, dy]) => {
                        const newRow = row + dx;
                        const newCol = col + dy;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                            if (board[newRow][newCol].dataset.mine) {
                                mines++;
                            }
                        }
                    });
                    if (mines > 0) {
                        board[row][col].textContent = mines;
                    }
                }
            }
        }
    }

    function revealCell(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (cell.classList.contains('revealed')) {
            return;
        }
        cell.classList.add('revealed');
        if (cell.dataset.mine) {
            cell.classList.add('mine');
            cell.style.display = 'block';
            alert('You hit a mine! Game over.');
            revealAllMines();
        } else if (cell.textContent === '') {
            revealEmptyCells(row, col);
        }
    }

    function revealEmptyCells(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        const stack = [[row, col]];
        while (stack.length > 0) {
            const [currentRow, currentCol] = stack.pop();
            directions.forEach(([dx, dy]) => {
                const newRow = currentRow + dx;
                const newCol = currentCol + dy;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    const adjacentCell = board[newRow][newCol];
                    if (!adjacentCell.classList.contains('revealed') && !adjacentCell.dataset.mine) {
                        adjacentCell.classList.add('revealed');
                        if (adjacentCell.textContent === '') {
                            stack.push([newRow, newCol]);
                        }
                    }
                }
            });
        }
    }

    function revealAllMines() {
        mineLocations.forEach(location => {
            const [row, col] = location.split(',').map(Number);
            const mineCell = board[row][col];
            mineCell.classList.add('revealed');
            mineCell.classList.add('mine');
            mineCell.style.display = 'block';
        });
    }

    resetButton.addEventListener('click', init);

    init();
});
