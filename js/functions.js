/**
 * Генерирует случайное целое число от 0 до max-1
 * @param {number} max - Максимальное значение (не включительно)
 * @return {number} Случайное целое число
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Обновляет значение рекорда в localStorage
 */
export function updateRecord() {
  let record = parseInt(localStorage.getItem("record") || "0", 10);
  record++;
  localStorage.setItem("record", record.toString());
}

/**
 * Добавляет обработчики для перезагрузки страницы при клике на кнопки
 * @param {NodeList} buttons - Кнопки для добавления обработчиков
 */
export function reloadPage(buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => location.reload());
  });
}

/**
 * Обрабатывает перезагрузку страницы по нажатию Enter при окончании игры
 * @param {NodeList} buttons - Кнопки которые будут отключены
 */
export function reloadPageOnEnd(buttons) {
  document.addEventListener("keydown", (event) => {
    const gameEnded =
      document.body.classList.contains("er-7") || document.body.classList.contains("winner");

    if (gameEnded) {
      buttons.forEach((button) => button.setAttribute("disabled", ""));

      if (event.key === "Enter") {
        location.reload();
      }
    }
  });
}

/**
 * Обрабатывает изменение сложности игры
 * @param {NodeList} inputs - Радио-кнопки выбора сложности
 */
export function changeDifficulty(inputs) {
  inputs.forEach((input) => {
    if (input.id === localStorage.getItem("difficulty")) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      localStorage.setItem("difficulty", input.id);
      resetGame();
    });
  });
}

/**
 * Добавляет обработчики для нажатия кнопок с буквами
 * @param {NodeList} buttons - Кнопки с буквами
 */
export function buttonsKlick(buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      this.setAttribute("disabled", "");
    });
  });

  window.addEventListener("keydown", (event) => {
    const buttonToClick = [...buttons].find(
      (button) => button.innerHTML.toLowerCase() === event.key.toLowerCase(),
    );

    if (buttonToClick && !buttonToClick.hasAttribute("disabled")) {
      buttonToClick.click();
    }
  });
}
