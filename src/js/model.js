import { async } from 'regenerator-runtime';
import { API_URL, API_KEY, NUM_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: NUM_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  /* The code snippet you provided is reassigning the `recipe` object with a modified structure.
      Here's a breakdown of what it's doing: */
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,

    // If recipe.key exist then we use key: recipe.key e;se dont display it
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
    //Will return true if any recipe is already bookmarked
    state.bookmarks.some(bookmark => bookmark.id === id)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
    // console.log(state.recipe);
  } catch (err) {
    //Temp error handling
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = 1) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQT = oldQt * newServingd/oldSERVINGS
  });
  state.recipe.servings = newServings;
};
// LocalStorage
const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete function
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// Debugger for clearing storage
const clearBookMarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookMarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // Objexct.entreis a nice way of collecting niput from forms
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingrArr = ing[1].split(',').map(el => el.trim());
        if (ingrArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, Please use the correct format :)'
          );
        const [quantity, unit, description] = ingrArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    // We had to make the data we received to go back to the format that we have been using always
    state.recipe = createRecipeObject(data);

    addBookMark(state.recipe);

    console.log(data);
  } catch (err) {
    throw err;
  }
};
