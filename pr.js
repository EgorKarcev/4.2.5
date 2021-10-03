const input = document.querySelector('.input__search');
const inputData = document.querySelector('.input__data');
const searchNow = document.querySelectorAll('.input__option');
const btnClose = document.querySelector('.result__closse');
const fixElement = document.querySelectorAll('.result__elem')
let inputFix = document.querySelector('.input__fix');
let option = document.querySelector('.input__option');
let map = new Map();
let search = '';

const debounce = (fn, mc) => {
  let timeout;
  return function () {
    const fncall = () => {
      fn.apply(this, arguments) 
    }
    clearTimeout(timeout)
    timeout = setTimeout(fncall, mc)
  };
};
async function getApi(search) {
    const url = `https://api.github.com/search/repositories?q=${search}`;
    try{
      const respons = await fetch(url)

      return respons.json()
    }
    catch (err){
      console.log(err);
    }
 }
 async function addList() {
	search = input.value;
	 const repositories = await getApi(search);

	if (option) {
		removeList()
	}
	
	let fragment = new DocumentFragment();

	for (let i = 0; i < 5; i++) {		

		option = document.createElement('div');
		option.classList.add('input__option'); 
		option.append(repositories.items[i]['name']);
		option.id = repositories.items[i]['id']
		 map.set(option.id, repositories.items[i])
		fragment.append(option)
	}	
	inputData.append(fragment)
}

function removeList() {
	const delEl = document.querySelectorAll('.input__option')
	delEl.forEach((el) => el.remove());
}

function removeElement() {
	const elem = document.querySelectorAll('.input__fix')
	elem.remove()
}
function createAddedElement(target) {
	//console.log(target)
	let fragment = new DocumentFragment();

	let fixElem = document.createElement('div');
	fixElem.classList.add('result__elem')
	 let leftSide = document.createElement('div')
	leftSide.classList.add('result__main')
	
	let resName = document.createElement('div')
	resName.classList.add('result__name')
	//console.log(map.get(target))
	resName.textContent = `Name: ${map.get(target).name}`
	leftSide.append(resName)

	let btnClose = document.createElement('button')
	btnClose.classList.add('result__closse')

	fixElem.append(leftSide);
	fixElem.append(btnClose);
	fragment.append(fixElem);

	inputFix.append(fragment);

	
	btnClose.addEventListener('click', () =>{
		fixElem.remove()
	})
}


input.addEventListener('keyup', debounce(addList, 500));
inputData.addEventListener('click', (ev) => {
	let target = ev.target;
	target.classList.add('input__option--active')

	createAddedElement(target.id);
	setTimeout(() => {
		input.value = '';

	}, 200)
	
})