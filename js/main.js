window.addEventListener('load',()=>{

  document.getElementById('cocktail_search').addEventListener('keypress', (e)=> {
    if(e.key === 'Enter'){
      drinkSearch()
      e.preventDefault()
    }
  })
  document.getElementById('get_cocktail_button').addEventListener('click', drinkSearch)
  document.getElementById('drinks_list').addEventListener('click', drinkClickHandler)

  drinkSearch()
});


function drinkClickHandler(e) { 
  if (e.target.classList.contains('pictures')){
      showDrinkInfo(e.target.closest('div'))
  }
}
async function drinkSearch () {
  await loadDrinks()
  const allDrinks = document.querySelectorAll('.drink_area')
  showDrinkInfo(allDrinks[0])
}

async function loadDrinks() {


let searchDrink = document.getElementById('cocktail_search').value.replaceAll(" ", "%20")
let reel = document.querySelector('.reel')
await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchDrink}`)
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    reel.innerText = ""
          const drinks = data['drinks']

    for(let drnNum = 0; drnNum < drinks.length; drnNum++){
      reel.appendChild(makeDrinkDiv(drinks[drnNum]))
    }
  })
  .catch(err => {
    console.log(`error ${err}`)
  });
}
function makeDrinkDiv(drinkInfo) {
  const drinkArea = document.createElement('div')
  
  let drinkName = document.createElement('p')
  let drinkPicture = document.createElement('img')
  let drinkInstructions = document.createElement('p')
  let ingredientList = document.createElement('ul')

  drinkArea.classList.add('drink_area')
  drinkName.classList.add('drink_name')
  drinkPicture.classList.add('pictures')
  drinkInstructions.classList.add('instructions', 'hidden')
  ingredientList.classList.add('ingredient_list', 'hidden')

  drinkName.innerText = drinkInfo['strDrink']  
  
  drinkPicture.src = drinkInfo['strDrinkThumb']
  drinkInstructions.innerText = drinkInfo['strInstructions']

  for(let ingNum = 1; ingNum < 16; ingNum++){
      let ingredients = document.createElement('li')
      ingredients.innerText = drinkInfo[`strIngredient${ingNum}`] + ': ' + drinkInfo[`strMeasure${ingNum}`]
      if(drinkInfo[`strIngredient${ingNum}`] == null || drinkInfo[`strIngredient${ingNum}`] === "" || drinkInfo[`strMeasure${ingNum}`] == null){
          break
      }
      ingredientList.appendChild(ingredients)
  }
  drinkArea.appendChild(drinkName)
  drinkArea.appendChild(drinkPicture)
  drinkArea.appendChild(drinkInstructions)
  drinkArea.appendChild(ingredientList)

  return drinkArea 
}

function showDrinkInfo(drinkDiv) {
 
  document.getElementById('current').src = drinkDiv.querySelector('.pictures').src
  document.getElementById('selected_drink_name').innerText = drinkDiv.querySelector('.drink_name').innerText
  document.getElementById('selected_drink_instructions').innerText = drinkDiv.querySelector('.instructions').innerText
  document.getElementById('drinkIngredients').innerHTML = drinkDiv.querySelector('.ingredient_list').innerHTML

}

let reel = document.querySelector('.reel')

let isDown = false
let startx
let scrollLeft

reel.addEventListener('mousedown', (e) => {
 isDown = true
 startx = e.pageX - reel.offsetLeft
 scrollLeft = reel.scrollLeft
 reel.style.cursor = 'grabbing'
 e.preventDefault()
})
reel.addEventListener('mouseleave', () => {
  isDown = false
})
reel.addEventListener('mouseup', () => {
 isDown = false
 reel.style.cursor = 'default'
})
reel.addEventListener('mousemove', (e) => {
  if(!isDown){
    return
  }
  e.preventDefault()
  const x = e.pageX - reel.offsetLeft
  const walk = (x - startx) * 1.5
  reel.scrollLeft = scrollLeft - walk
})