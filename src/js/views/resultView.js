import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No recipe found for your query please try again`;
  _message = '';

  //   You will get confused again.
  //   Preview is from previewView.js
  // We refactored the code
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
