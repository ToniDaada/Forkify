import * as model from './model.js';
import recipeView from './views/recipeView.js';

/* The line `import icons from 'url:../img/icons.svg';` is importing an SVG file named `icons.svg` from
the specified URL path. This import statement is using the Parcel bundler's v2 feature for handling
static assets like images. */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

/* The code `if (module.hot) { module.hot.accept(); }` is used for handling hot module replacement
(HMR) in a JavaScript application. */
// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.jonas.io
///////////////////////////////////////

/**
 * The function `showRecipe` fetches recipe data from an API, processes it, and logs the recipe details
 * to the console or alerts an error if there is one.
 */

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Spinning animation
    recipeView.renderSpinner();

    // 0 update results view on selceted serarch result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1)Loadingrecipe
    await model.loadRecipe(id);

    // 2 Redering recipe

    recipeView.render(model.state.recipe);

    // controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1 Get Searvh Query
    const query = searchView.getQuery();
    if (!query) {
      resultView.renderError('Search field is empty');
      return;
    }
    resultView.renderSpinner();
    console.log(resultView);

    // 2 Load Search Reuslts
    await model.loadSearchResults(query);

    //3 Render Results
    // console.log(model.getSearchResultsPage());
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage(1));

    // Render initail pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render New Results
  resultView.render(model.getSearchResultsPage(goToPage));
  // Render New Paginaion Results
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // 1) Add/ Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  // Update recipe view
  recipeView.update(model.state.recipe);
  // 3 Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // sPINNER
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render recipe view
    recipeView.render(model.state.recipe);

    // Render Suces message
    addRecipeView.renderSuccess();

    // Rnder bookmark vuew
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //  Close Form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error('**', err.message);
    addRecipeView.renderError(err.message);
  }
};

/**
 * @param {init} Handles all the event listeners
 * runs immmediately
 * @returns {undefined}
 */
const init = function () {
  // EVENT LISTENERS
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  // Updates servings
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  // Add Recipe
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
