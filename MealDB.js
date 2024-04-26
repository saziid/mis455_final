const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals-container");
const detailsContainer = document.getElementById("details");
const notFoundText = document.getElementById("not-found");

searchBtn.addEventListener("click", function () {
  let searchInputValue = searchInput.value;
  if (searchInputValue == "") {
    alert("You have to write something");
    return false;
  }
  // function to check if any items need to be removed
  removeItems();

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputValue}`)
  .then((res) => res.json())
  .then((data) => {
    validate(data);
    // get meals in dom
    data.meals.forEach((meal) => {
      let domStr = `<img src="${meal.strMealThumb}"><h3>${meal.strMeal}</h3>`;
      const singleMeal = document.createElement("div");
      singleMeal.classList.add("single-meal");
      singleMeal.innerHTML = domStr;
      mealsContainer.prepend(singleMeal);
      searchInput.value = "";
      singleMeal.addEventListener("click", function () {
        getDetails(meal);
      });
    });
  });
});

// get Details function
const getDetails = (meal) => {
  let mealName = meal.strMeal;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then((res) => res.json())
    .then((data) => {
      let allDetails = `<img src="${data.meals[0].strMealThumb}"> <h3>${data.meals[0].strMeal}</h3><h4>Ingredients</h4>`;
      detailsContainer.innerHTML = allDetails;
      window.scrollTo({ top: 0, behavior: "smooth" });
      for (const [key, value] of Object.entries(data.meals[0])) {
        for (let i = 1; i < 25; i++) {
          if (key === `strIngredient${i}` && value !== "" && value !== null) {
            let li = document.createElement("li");
            li.innerText = `${value}`;
            detailsContainer.appendChild(li);
          }
        }
      }
    });
};
// Validate function
const validate = (data) => {
  console.log(data);
  if (data.meals == null) {
    notFoundText.style.display = "block";
    setTimeout(() => {
      notFoundText.style.display = "none";
    }, 3000);
    searchInput.value = "";
  }
};

// remove content from before
const removeItems = () => {
  if (detailsContainer.hasChildNodes()) {
    detailsContainer.innerHTML = "";
  }
  if (mealsContainer.hasChildNodes()) {
    mealsContainer.innerHTML = "";
  }
};
