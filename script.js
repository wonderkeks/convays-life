document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const resizeButton = document.getElementById('resize');
    const randomButton = document.getElementById('random');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const genTimeDisplay = document.getElementById('gen-time');

    let rows = parseInt(rowsInput.value);
    let cols = parseInt(colsInput.value);
    let cells = [];
    let interval;
    let generationTime = 0;

    const createGrid = () => {
        grid.innerHTML = '';
        grid.style.gridTemplateRows = `repeat(${rows}, 20px)`;
        grid.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
        cells = [];

        for (let y = 0; y < rows; y++) {
            cells[y] = [];
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('click', () => {
                    cell.classList.toggle('alive');
                });
                grid.appendChild(cell);
                cells[y][x] = cell;
            }
        }
    };

    const getNeighbors = (x, y) => {
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    const nx = (x + dx + cols) % cols;
                    const ny = (y + dy + rows) % rows;
                    neighbors.push(cells[ny][nx]);
                }
            }
        }
        return neighbors;
    };

    const updateGrid = () => {
        const newCells = cells.map(row => row.map(cell => cell.classList.contains('alive')));
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const neighbors = getNeighbors(x, y);
                const aliveNeighbors = neighbors.filter(cell => cell.classList.contains('alive')).length;
                if (cells[y][x].classList.contains('alive')) {
                    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                        newCells[y][x] = false;
                    }
                } else {
                    if (aliveNeighbors === 3) {
                        newCells[y][x] = true;
                    }
                }
            }
        }
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (newCells[y][x]) {
                    cells[y][x].classList.add('alive');
                } else {
                    cells[y][x].classList.remove('alive');
                }
            }
        }
    };

    const startGame = () => {
        const start = performance.now();
        updateGrid();
        const end = performance.now();
        generationTime = end - start;
        genTimeDisplay.textContent = generationTime.toFixed(2);
    };

    resizeButton.addEventListener('click', () => {
        rows = parseInt(rowsInput.value);
        cols = parseInt(colsInput.value);
        createGrid();
    });

    randomButton.addEventListener('click', () => {
        cells.forEach(row => row.forEach(cell => {
            cell.classList.toggle('alive', Math.random() > 0.5);
        }));
    });

    startButton.addEventListener('click', () => {
        if (!interval) {
            interval = setInterval(startGame, 100);
        }
    });

    stopButton.addEventListener('click', () => {
        clearInterval(interval);
        interval = null;
    });

    createGrid();
});
