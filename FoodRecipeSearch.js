/**
 * Cecilia Tong
 * Final Project
 * Dec 20, 2022
 * Food Recipe Search
 */

const formEl = document.getElementById('food-recipe-search-form');
const recipeEl = document.getElementById('recipe');

//submit recipe to start searching
formEl.addEventListener('submit', async function (e) {
  e.preventDefault();
  const recipe = recipeEl.value;

  // Fetch food recipe search
  const BASE_URL = 'https://api.edamam.com/api/recipes/v2'; //Edamam recipe link
  const API_KEY = '9b27e66e64dd12b4db22686d88eca6d7'; //Edamam recipe search API key
  const APP_ID = 'bc3c7a1a'; //ID
  //'any' and 'public' work, 'user' does not work
  //const url = `${BASE_URL}?type=public&beta=true&q=${recipe}&app_id=${APP_ID}&app_key=${API_KEY}`;
  const url = `${BASE_URL}?type=any&q=${recipe}&app_id=${APP_ID}&app_key=${API_KEY}&to=4`;

  recipeEl.addEventListener('click', () => {
    history.go(0); //reload the page to work with Edamam (to avoid using next page link)
  })

  recipeEl.addEventListener('keypress', () => {
    history.go(0); //reload the page to work with Edamam (to avoid using next page link)
  })

  //start fetch
  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (responseJson) {
      console.log(responseJson);

      //list recipes
      const listRecipes = responseJson.hits;
      if (listRecipes.length == 0) {
        alert("No recipe found!");
      }

      for (let i = 0; i < listRecipes.length; i++) {
        const divEl = document.getElementById('recipes-container');//referance <div> for row 

        //create label for each recipe  
        const divElCol = document.createElement('div');
        divEl.appendChild(divElCol);
        divElCol.classList.add("column");
        const recipeStr = listRecipes[i].recipe;

        const h6 = document.createElement('h6');
        const h6Txt = document.createTextNode(`${i + 1}. ${recipeStr.label} 
        (${recipeStr.cuisineType[0].charAt(0).toUpperCase() + recipeStr.cuisineType[0].slice(1)}, 
        ${recipeStr.mealType[0]})`);
        h6.appendChild(h6Txt);
        divElCol.appendChild(h6);

        //create text for cuisine type and cal info
        const h6El = document.createElement('h6');
        const h6Text = document.createTextNode(`Calories: ${recipeStr.calories.toFixed(2)}`);
        h6El.appendChild(h6Text);
        divElCol.appendChild(h6El);

        //create link to recipe
        const aEl = document.createElement('a');
        const aElText = document.createTextNode(`View recipe`);
        aEl.appendChild(aElText);
        aEl.href = `${recipeStr.url}`;
        aEl.style.color = 'blue';
        aEl.style.fontSize = 'large';
        aEl.style.fontStyle = 'italic'
        divElCol.appendChild(aEl);

        //to open recipe in a new window and keep search result to display
        aEl.addEventListener('click', (e)=> {
          e.preventDefault();
          window.open(`${recipeStr.url}`);
        })

        //create image and display image for book
        const imageEl = document.createElement('img');
        imageEl.src = recipeStr.image;
        imageEl.width = 300;
        imageEl.height = 300;
        imageEl.alt = recipeStr.label;
        imageEl.style.width = 100 %
          divElCol.appendChild(imageEl); // add new <p> to <div>
      } //end for loop (i)    
    }); //end fetch  
}); //end form