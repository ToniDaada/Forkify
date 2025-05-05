import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';
class BookMarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');

  _errorMessage = `No bookmarks yet, find a nice recipe and bookmark it :)`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //   You will get confused again.
  //   Preview is from previewView.js
  // We refactored the code
  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join('');
  }
}

export default new BookMarkView();
