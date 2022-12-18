/**
 * Cecilia Tong
 * Final Project
 * Dec 20, 2022
 * Food Recipe Search
 */




/********************************************************************
* Function to display timer and will auto refresh page after certain time
*********************************************************************/
function myTimer() {
  const d = new Date();
  document.getElementById("timer").innerHTML = d.toLocaleTimeString();
}

//setInterval(myTimer, 10); //to start the clock, call myTimer ever 10ms
//setTimeout(myTimer,10); //fix number

//setTimeout(autoReload, 5000); //auto reload after 5s

function autoReload() {
  location.reload(true);  
}

//myInterval = setInterval(setColor, 500);

//background-image: url(background.jpeg);
 
function setBGImage() {
  let x = document.body;
  //x.style.backgroundColor = x.style.backgroundColor == "yellow" ? "pink" : "yellow";
  x.style.backgroundImage = x.style.backgroundImage == "background.jpeg" ? "background.jpg" : "background.jpeg";

}







/********************************************************************
* Food Recipe Searching
* Using Edamam Recipe Search API
* Allows up to 20 recipes each search
*********************************************************************/
//these are for searching recipe
const formSearch = document.getElementById('food-recipe-search-form');
const recipeEl = document.getElementById('recipe');

//these are for sending feed back
const wantFBForm = document.getElementById("want-feedback-form");
const sendFBForm = document.getElementById('send-feedback-form');
const emailFB = document.getElementById('email');
const messageFB = document.getElementById('message');
const sendFBButton = document.getElementById('sendFB');

//submit recipe to start searching
formSearch.addEventListener('submit', async function (e) {
  e.preventDefault();
  const recipe = recipeEl.value;

  // Fetch food recipe search
  const BASE_URL = 'https://api.edamam.com/api/recipes/v2'; //Edamam recipe link
  const API_KEY = '9b27e66e64dd12b4db22686d88eca6d7'; //Edamam recipe search API key
  const APP_ID = 'bc3c7a1a'; //ID
  const url = `${BASE_URL}?type=any&q=${recipe}&app_id=${APP_ID}&app_key=${API_KEY}&to=4`;

  //reload the page to work with Edamam (to avoid using next page link)
  recipeEl.addEventListener('click', () => {
    history.go(0);
  })

  //reload the page to work with Edamam (to avoid using next page link)
  recipeEl.addEventListener('keypress', () => {
    history.go(0);
  })

  //start FETCH for food recipes
  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then(function (responseJson) {
      console.log(responseJson);

      //display alart if no recipes found
      const listRecipes = responseJson.hits;
      if (listRecipes.length == 0) {
        alert("No recipe found!");
      }

// //hide feedback fields while searching for recipe
// emailFB.style.display = 'none';
// messageFB.setAttribute("hidden", "hidden");
// sendFB.setAttribute("hidden", "hidden");
// wantFBForm.removeAttribute('hidden');

      //display recipes
      for (let i = 0; i < listRecipes.length; i++) {
        const recipeStr = listRecipes[i].recipe; //recipe
        const divEl = document.getElementById('recipes-container');//referance <div> for row 

        //create label for each recipe  
        const divElCol = document.createElement('div');
        divEl.appendChild(divElCol);
        divElCol.classList.add("column");

        //info for cuisine and mealtype
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
        aEl.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(`${recipeStr.url}`);
        })

        //create image and display image for recipe
        const imageEl = document.createElement('img');
        imageEl.src = recipeStr.image;
        imageEl.width = 300;
        imageEl.height = 300;
        imageEl.alt = recipeStr.label;
        imageEl.style.width = 100 %
          divElCol.appendChild(imageEl);
      } //end for loop (i)    
    }); //end fetch  

  //hide feedback fields while searching for recipe
  emailFB.style.display = 'none';
  messageFB.setAttribute("hidden", "hidden");
  sendFB.setAttribute("hidden", "hidden");
  wantFBForm.removeAttribute('hidden');
}); //end form

/********************************************************************
* Function checkStrLen()
* @param {event,String,number} e, string, minLen
* function to check string length (for feedback message)
*********************************************************************/
function checkStrLen(e, string, minLen) {
  let allValid = false;
  string.setCustomValidity('');

  // check string lenght
  if (string.value.length < minLen) {
    string.validity.valid = false;
    string.parentElement.classList.add("invalid");
    string.setCustomValidity(`${string.name} must be ${minLen} chars or more`);
  } else {
    string.validity.valid = true;
    string.parentElement.classList.remove("invalid");
    allValid = true;
  }
  if (!allValid) {
    e.preventDefault();
    console.log(`Bad input.`);
  }
} //end function checkStrLen(e, string, minLen)

/********************************************************************
* Function checkEmail(e)
* @param {event} e
* fucntion to check email (basic format regEx = /\w+@\w+\.\w+/;)
*********************************************************************/
function checkEmail(e) {
  let allValid = false;
  emailFB.setCustomValidity('');
  const regEx = /\w+@\w+\.\w+/;
  if (!regEx.test(emailFB.value)) {
    emailFB.validity.valid = false;
    emailFB.parentElement.classList.add("invalid");
    emailFB.setCustomValidity(`You must enter a valid email in the format '${regEx}'`);
  }
  else {
    emailFB.validity.valid = true;
    emailFB.parentElement.classList.remove("invalid");
    allValid = true;
  }
  if (!allValid) {
    e.preventDefault();
    console.log(`Bad input.`);
  }
} //end function checkEmail(e)

/********************************************************************
* if user wants to send feed back, click the 'feedback?' button to 
* get fields for feeback
*********************************************************************/
//if user wants to send feed back, click the 'feedback?' button to get fields for feeback
wantFBForm.addEventListener('submit', (e) => {
  //display fields for feedback
  e.preventDefault();
  emailFB.style.display = 'block';
  messageFB.removeAttribute('hidden');
  sendFBButton.removeAttribute('hidden');
  wantFBForm.setAttribute("hidden", "hidden"); //hide 'feedbaack?' button
})

/********************************************************************
* To send feedback with email and message. There are function 
* checkEmail(e) to validate email and checkStrLen(e, messageFB, 10) 
* to validate message string
*********************************************************************/
sendFBForm.addEventListener('submit', (e) => {
  checkEmail(e);
  sendFBForm.reportValidity();
  checkStrLen(e, messageFB, 10);
  sendFBForm.reportValidity();
});

