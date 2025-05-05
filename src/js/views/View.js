import icons from 'url:../../img/icons.svg';
// Parent clASS
export default class View {
  _data;

  /**
   *  Render the received object to DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render =false
   * @this {Object} View instance
   * @author Toni Daada
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // Refactoring for prevView.js .Implementing bookmars part 2
    if (!render) return markup;

    // //////////////////////////////////
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
         
           <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div> 
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // For updating the parts that are different on each page. Like state
  // Updating the text
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    // console.log(curElements, newElement);

    newElement.forEach((newElement, i) => {
      const curEl = curElements[i];
      // console.log(newElement.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newElement.isEqualNode(curEl) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newElement.firstChild?.nodeValue.trim(), '****');
        curEl.textContent = newElement.textContent;
      }

      // UPDATE CHANGED ATTRIBUTE
      if (!newElement.isEqualNode(curEl)) {
        // console.log(Array.from(newElement.attributes));
        Array.from(newElement.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
      
      `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderSuccess(message = this._successMessage) {
    const markup = `
           <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      
      `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
