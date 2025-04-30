//* Импорты классов, функций
import { Modal } from "./classes.js";
import {
  getRandomInt,
  updateRecord,
  reloadPage,
  changeDifficulty,
  buttonsKlick,
  reloadPageOnEnd,
} from "./functions.js";

/**
 * Основные переменные игры
 */
const elements = {
  buttons: document.querySelectorAll(".button__wrapper button"),
  body: document.body,
  wordContainer: document.getElementById("word"),
  restart: document.querySelectorAll(".btn-restart"),
  record: document.getElementById("record"),
  formInput: document.querySelectorAll(".form-pop_item input"),
  resetBtn: document.querySelector(".panel_btn-restart"),
  themeElement: document.querySelector(".theme__name"),
};

/**
 * Модальные окна
 */
const modals = {
  question: {
    open: document.querySelector(".panel_btn-info"),
    close: document.querySelector(".question-pop_close"),
  },
  form: {
    open: document.querySelector(".panel_btn-form"),
    close: document.querySelector(".form-pop_close"),
  },
};

// Игровые переменные
let errors = 1;
let trueLetters = 0;

// Проверка наличия сложности в localStorage
if (localStorage.getItem("difficulty") == null) {
  elements.body.classList.add("form-pop_active");
}

/**
 * Загрузка и инициализация данных игры
 */
fetch("./data/database.json")
  .then((response) => response.json())
  .then((data) => initializeGame(data))
  .catch((error) => console.error("Ошибка при загрузке JSON:", error));

/**
 * Инициализация игры
 * @param {Array} data - Данные игры из JSON файла
 */
function initializeGame(data) {
  elements.formInput.forEach((input) => {
    input.addEventListener("click", () => resetGame(data));
  });

  elements.resetBtn.addEventListener("click", () => resetGame(data));
  setupButtonListeners(data);
  resetGame(data);

  // Создаем экземпляры класса для попапов
  const questionModal = new Modal(modals.question.open, modals.question.close, "question-pop");
  const formModal = new Modal(modals.form.open, modals.form.close, "form-pop");
}

/**
 * Выбор слова в зависимости от сложности
 * @param {Array} data - Данные игры из JSON файла
 * @return {Object} Объект содержащий выбранное слово и его тему
 */
function selectWordBasedOnDifficulty(data) {
  const difficulty = localStorage.getItem("difficulty");
  let selectedWord, theme;

  do {
    const randomCategoryIndex = getRandomInt(data.length);
    const category = data[randomCategoryIndex];
    const randomWordIndex = getRandomInt(category.gameWord.length);
    selectedWord = category.gameWord[randomWordIndex];
    theme = category.gameTheme;
  } while (
    (difficulty === "easy" && selectedWord.length > 5) ||
    (difficulty === "medium" && selectedWord.length > 8) ||
    (difficulty === "hard" && selectedWord.length < 8)
  );

  return { selectedWord, theme };
}

/**
 * Обновление контейнера слова
 * @param {string} selectedWord - Выбранное слово
 * @param {string} theme - Тема слова
 */
function updateWordContainer(selectedWord, theme) {
  elements.themeElement.innerHTML = theme;
  elements.wordContainer.innerHTML = selectedWord
    .split("")
    .map((letter) => `<span><p class="false">${letter}</p></span>`)
    .join("");
}

/**
 * Сброс игры
 * @param {Array} data - Данные игры из JSON файла
 */
window.resetGame = function (data) {
  errors = 1;
  trueLetters = 0;
  elements.body.className = "";

  const { selectedWord, theme } = selectWordBasedOnDifficulty(data);

  elements.buttons.forEach((buttonElement) => {
    buttonElement.className = "";
    buttonElement.removeAttribute("disabled");
  });

  updateWordContainer(selectedWord, theme);
};

/**
 * Настройка обработчиков событий для кнопок с буквами
 */
function setupButtonListeners() {
  elements.buttons.forEach((buttonElement) => {
    buttonElement.addEventListener("click", function () {
      const letterCheck = buttonElement.value.toLowerCase();
      const wordElements = document.querySelectorAll(".game__word span p");
      let found = false;

      // Проверка наличия нажатой буквы в слове
      wordElements.forEach((wordElement) => {
        if (letterCheck === wordElement.innerHTML) {
          wordElement.classList.replace("false", "true");
          buttonElement.classList.add("btn-true");
          trueLetters++;
          found = true;
        }
      });

      // Обработка результата нажатия
      if (!found) {
        handleWrongLetter(wordElements);
      } else if (trueLetters === wordElements.length) {
        handleWin();
      }
    });
  });
}

/**
 * Обработка неправильной буквы
 * @param {NodeList} wordElements - Элементы букв загаданного слова
 */
function handleWrongLetter(wordElements) {
  elements.body.classList.add(`er-${errors++}`);

  // Если достигнуто максимальное количество ошибок
  if (errors === 8) {
    localStorage.setItem("record", "0");
    wordElements.forEach((wordElement) => {
      wordElement.classList.add("true");
    });
  }
}

/**
 * Обработка победы
 */
function handleWin() {
  elements.body.classList.add("winner");
  updateRecord();
  elements.record.innerHTML = localStorage.getItem("record");
}

// Инициализация дополнительных функций
reloadPageOnEnd(elements.buttons);
changeDifficulty(elements.formInput);
buttonsKlick(elements.buttons);
reloadPage(elements.restart);
