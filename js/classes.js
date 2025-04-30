/**
 * Класс для создания и управления модальными окнами
 */
export class Modal {
  /**
   * Создает экземпляр модального окна
   * @param {HTMLElement} openButton - Кнопка открытия модального окна
   * @param {HTMLElement} closeButton - Кнопка закрытия модального окна
   * @param {string} modalClass - CSS класс модального окна
   */
  constructor(openButton, closeButton, modalClass) {
    //* Элементы попапа
    this.openButton = openButton;
    this.closeButton = closeButton;
    this.modalClass = modalClass;
    this.body = document.body;

    //* Клик на кнопку открытия попапа
    this.openButton.addEventListener("click", this.openModal.bind(this));
    //* Клик на кнопку закрытия попапа
    this.closeButton.addEventListener("click", this.closeModal.bind(this));
  }

  /**
   * Открывает модальное окно
   */
  openModal() {
    this.body.classList.add(`${this.modalClass}_active`);
  }

  /**
   * Закрывает модальное окно
   */
  closeModal() {
    this.body.classList.remove(`${this.modalClass}_active`);
  }
}
