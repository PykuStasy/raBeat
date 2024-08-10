let score = 0;
let animalIntervals = [];
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const SCORE_LIMIT = 200;
const POINTS_PER_HIT = 15; // Очки за одно попадание

function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameBoard.innerHTML = '';
    createCells();
    startAnimalIntervals(); // Запускаем интервал для появления животных
    gameContainer.style.display = 'block'; // Показываем игровое поле
    startContainer.style.display = 'none'; // Скрываем стартовый экран
}

function createCells() {
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => hitCell(i));
        gameBoard.appendChild(cell);
    }
}

function hitCell(index) {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    const animal = cell.querySelector('img');

    if (animal) {
        if (animal.classList.contains('red-animal')) {
            score = 0; // Сбрасываем очки
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            score += POINTS_PER_HIT; // Добавляем очки за попадание
            scoreDisplay.textContent = `Score: ${score}`;
        }
        cell.innerHTML = ''; // Убираем изображение
        if (score >= SCORE_LIMIT) {
            endGame();
        }
    }
}

function startAnimalIntervals() {
    // Очистка предыдущих интервалов, если они есть
    animalIntervals.forEach(interval => clearInterval(interval));
    animalIntervals = [];

    // Функция для показа животных в случайных ячейках
    function showAnimals() {
        const cells = document.querySelectorAll('.cell');
        // Убираем всех животных с предыдущего раунда
        cells.forEach(cell => cell.innerHTML = '');

        // Определяем случайное количество обычных животных для появления (1 или 2)
        const numAnimals = Math.random() < 0.5 ? 1 : 2;
        const animalPositions = new Set();
        while (animalPositions.size < numAnimals) {
            // Выбираем случайную ячейку для обычных животных
            const randomIndex = Math.floor(Math.random() * cells.length);
            animalPositions.add(randomIndex);
        }

        // Показываем обычные животные в выбранных ячейках
        animalPositions.forEach(index => {
            const cell = cells[index];
            if (!cell.querySelector('img')) { // Убедитесь, что ячейка пуста
                const animal = document.createElement('img');
                animal.src = 'images/animal.png'; // Укажите путь к вашему изображению
                animal.alt = 'Animal';
                cell.appendChild(animal);
            }
        });

        // Случайное появление красного животного
        if (Math.random() < 0.1) { // 10% шанс на появление красного животного
            const redAnimalCell = cells[Math.floor(Math.random() * cells.length)];
            if (!redAnimalCell.querySelector('img')) { // Убедитесь, что ячейка пуста
                const redAnimal = document.createElement('img');
                redAnimal.src = 'images/red-animal.png'; // Укажите путь к вашему изображению
                redAnimal.alt = 'Red Animal';
                redAnimal.classList.add('red-animal');
                redAnimal.onclick = () => {
                    score = 0; // Сбрасываем очки
                    scoreDisplay.textContent = `Score: ${score}`;
                    redAnimalCell.innerHTML = ''; // Убираем красное животное
                };
                redAnimalCell.appendChild(redAnimal);
            }
        }
    }

    // Запуск интервала для показа животных с более частыми и случайными интервалами
    const showInterval = setInterval(showAnimals, getRandomInterval());

    // Функция для получения случайного интервала
    function getRandomInterval() {
        return Math.floor(Math.random() * 1000) + 500; // Интервал от 0.5 до 1.5 секунд
    }

    // Храним ID интервала для возможности его очистки при окончании игры
    animalIntervals.push(showInterval);
}

function endGame() {
    animalIntervals.forEach(interval => clearInterval(interval)); // Останавливаем появление животных
    setTimeout(() => {
        gameContainer.style.display = 'none'; // Скрываем игровое поле
        startContainer.style.display = 'block'; // Показываем стартовый экран
    }, 1000); // Небольшая задержка для завершения анимации
}

// Убедитесь, что скрипт выполняется после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    startContainer.style.display = 'block'; // Показываем стартовый экран при загрузке
});
