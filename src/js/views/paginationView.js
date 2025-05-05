import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupNext(currentPage);
    }

    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupPrev(currentPage);
    }
    // Other pages
    if (currentPage < numPages && currentPage > 1) {
      return this._generateMarkupBoth(currentPage);
    }
    // Page 1, and there NO other pages
    return ``;
  }

  _generateMarkupPrev(currentPage) {
    return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>
  `;
  }
  _generateMarkupNext(currentPage) {
    return `<button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
     <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;
  }
  _generateMarkupBoth(currentPage) {
    return [
      this._generateMarkupPrev(currentPage),
      this._generateMarkupNext(currentPage),
    ];

    //     <button data-goto="${
    //       currentPage - 1
    //     }" class="btn--inline pagination__btn--prev">
    //     <svg class="search__icon">
    //       <use href="${icons}#icon-arrow-left"></use>
    //     </svg>
    //     <span>Page ${currentPage - 1}</span>
    //   </button>
    //   <button data-goto="${
    //     currentPage + 1
    //   }" class="btn--inline pagination__btn--next">
    //     <span>Page ${currentPage + 1}</span>
    //     <svg class="search__icon">
    //      <use href="${icons}#icon-arrow-right"></use>
    //   </svg>
    // </button>`;
  }
}

export default new PaginationView();
