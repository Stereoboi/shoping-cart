import Notiflix from 'notiflix';
import { products } from "./data"
import refs from "./js/refs";

const { cartRef, productGalleryRef,
        totalPrice, totalQuan,
        logoRef, closeModalBtnRef,
        headerNumber, modal,
        openModalRef,discountInputRef,checkoutBtnRef } = refs

        
openModalRef.addEventListener('click', onOpenModal);
closeModalBtnRef.addEventListener('click', onCloseModal);
cartRef.addEventListener('click', onProductCartClick);
productGalleryRef.addEventListener('click', onProductCardClick);
discountInputRef.addEventListener('input', discount);

let currentCard = {};
let cart = [];

function onCloseModal(event) {
  modal.classList.toggle("is-hidden");
}

function onOpenModal(event) {
  modal.classList.toggle("is-hidden");
}

function renderCards() {
    const productCard = products.map(product => {
        return `
        <li class="item">
        <p class="hidden" id="blk" >${product.id}</p>
        <a href="#" class="examples">
          <div class="thumb-cards">
            <img src="${product.img}" alt="${product.description}" width="250">
          </div>
          <div class="cards-info">
            <h2 class="card-title zagolovok">${product.name}</h2>
            <button data-id=${product.id} class="card-btn">Add to cart</button>
          </div>
        </a>
      </li>
        `
    }).join('');
    productGalleryRef.insertAdjacentHTML('afterbegin', productCard)
    
}

renderCards()


function onProductCardClick(event) {
    event.preventDefault();
    if (event.target.nodeName !== "BUTTON") {
        return
    }
    const id = event.target.closest('button').dataset.id
    currentCard = products.find((product) => product.id == id)
    cartCheck(id, currentCard);

    renderSubtotal(cart);
}

function cartCheck(id , currentCard) {
  if (cart.some((item) => item.id == id)) {
     return Notiflix.Notify.info(`Product are alredy in the cart`);
  }
  cart.push({
      ...currentCard,
      numberOfUnits: 1,
  })
  renderItem(currentCard);
}

function renderItem(currentCard) {
  const renderArray = [];
  renderArray.push(currentCard);
  const chosenProduct = renderArray.map(product => {
    return `
                <li class="ordered-item">
                    <img src="${product.img}" alt="${product.description}" width="150">
                    <div class="text-wrapper">
                        <p class="order-title">Shoes</p>
                        <p class="order-name">${product.name}</p>
                    </div>
                    <div id="counter">
                        <div class ="number-wrapper">
                          <button type="button" class="decrement" data-action="${product.id}">-</button>
                          <p class="number">1</p>
                          <button type="button" class="increment" data-action="${product.id}">+</button>
                        </div>
                    </div>
                    <p class="product-cost">${product.price}$</p>
                    <button type="button" class="delete-product" data-action="${product.id}">Delete</button>
                </li>                      
    `
  }).join('');
  cartRef.insertAdjacentHTML('afterbegin', chosenProduct);
  
}

function renderSubtotal(cart) {
  const sum = cart.map(a => a.price * a.numberOfUnits).reduce((a, b) => a + b, 0).toFixed(2)
  totalPrice.innerHTML = `TOTAL PRICE  ${sum} $`;
  totalQuan.innerHTML = `${cart.length} Items in cart!`
  logoRef.innerHTML = `Items  ${cart.length}`;
  headerNumber.innerHTML = cart.length;
}

function onProductCartClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== "BUTTON") {
        return
  }
  
  increment(event);
  
  decrementProduct(event);

  deleteProductFromCart(event);
}

function increment(event) {
  if (event.target.classList.contains('increment')) {

    incrementNumberOfUnits(event)

    reRenderAfterIncrement(event)
     
  }
}

function incrementNumberOfUnits (event) {
    const id = event.target.closest('button').dataset.action
    currentCard = cart.find((product) => product.id == id)
    if (currentCard.numberOfUnits === currentCard.instock) {
      return
    }
    currentCard.numberOfUnits += 1;
}

function reRenderAfterIncrement(event) {
  if (currentCard.instock == event.target.previousElementSibling.textContent) {
      return
    } else {
      const sum = cart.map(a => a.price * a.numberOfUnits).reduce((a, b) => a + b, 0).toFixed(2);
      totalPrice.innerHTML = `TOTAL PRICE  ${sum} $`;
      let number = event.target.previousElementSibling;
      number.innerHTML = currentCard.numberOfUnits;
    }
}

function deleteProductFromCart (event) {
  if (event.target.classList.contains('delete-product')) {
    const item = event.target.parentNode
    const id = event.target.closest('button').dataset.action;
    const search = cart.find(a => a.id == id )
    const index = cart.indexOf(search)
    cart.splice(index, 1);
    const sum = cart.map(a => a.price * a.numberOfUnits).reduce((a, b) => a + b, 0).toFixed(2);
    totalPrice.innerHTML = `TOTAL PRICE  ${sum} $`;
    totalQuan.innerHTML = `${cart.length} Items in cart!`
    logoRef.innerHTML = `Items  ${cart.length}`;
    headerNumber.innerHTML = cart.length;
    item.innerHTML= ''
  }
}

function decrementProduct(event) {
   if (event.target.classList.contains('decrement')) {
     decrementNumberOfUnits(event);
     reRenderAfterDecrement(event); 
  }
}

function decrementNumberOfUnits(event) {
  const id = event.target.closest('button').dataset.action;
    currentCard = cart.find((product) => product.id == id)
    if (event.target.nextElementSibling.textContent == 1 ) {
      return
    } 
      currentCard.numberOfUnits -= 1;
}

function reRenderAfterDecrement(event) {
      const sum = cart.map(a => a.price * a.numberOfUnits).reduce((a,b) => a+b,0).toFixed(2)
      totalPrice.innerHTML = `TOTAL PRICE  ${sum} $`;
      let number = event.target.nextElementSibling;
      number.innerHTML = currentCard.numberOfUnits;
}

function discount(event) {
  if (event.target.value === 'saske') {
    event.target.style.backgroundColor = 'rgba(12, 189, 145, 0.3';
    const sum = cart.map(a => a.price * a.numberOfUnits).reduce((a, b) => a + b, 0).toFixed(2);
    const discount = (sum - (sum * 0.15)).toFixed(2);
    totalPrice.innerHTML = `TOTAL PRICE  ${discount} $`;
  }
}
