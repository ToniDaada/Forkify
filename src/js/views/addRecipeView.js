import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload ');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _successMessage = `Recipe Successfully Added`;

  constructor() {
    super();
    // These functions are called immediately this addRecipeView object is created.
    // So we just imported this file in controller.js
    this._addHandlerShowAndCloseWindow();
  }

  //   Had to export the function
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // toglling the add Recipe window and overlay
  _addHandlerShowAndCloseWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //   Want to handle the submit event
  _addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //   New Form Api that collects all values of a form
      //   Spreading and putting in an array
      const dataArr = [...new FormData(this)];
      //   ES2019 format that converts array to object from its entries
      // e.g [title, TEST],[sourceUrl, TEST] will look like {title: TEST, sourceUrl :TEST}
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
