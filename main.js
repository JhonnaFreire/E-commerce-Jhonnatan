//* URL base
const baseUrl = 'https://ecommercebackend.fundamentos-29.repl.co/'
//* Shows code on cart
const carToggle = document.querySelector('.car__toggle');
const carBlock = document.querySelector('.car__block');
//* Show product on the web
const productsList = document.querySelector('#product-container');
//* shopping cart
const cart = document.querySelector('#car');
const cartList = document.querySelector('#car__list');
//* empty cart
emptyCarButtton = document.querySelector('#empty__cart') 
//? We need an array that receives the elements we should introduce into the shopping cart
let cartProducts =[];
//* Modal
const modalContainer = document.querySelector('#modal-container');
const modalElement = document.querySelector('#modal');
let modalDetails = [];
//* Logic to hide cart
carToggle.addEventListener('click', () => {
  carBlock.classList.toggle('nav__car__visible')
  //* When you do NOT have the nav__car_visible class, you add it. If it is clicked again and it detects the class, it removes it.
})
//! We will create a function that contains and execute all the listeners from the beginnin of the load of this code
eventListenersLoader()
function eventListenersLoader() {
  //* When we use button 'add to cart'
  productsList.addEventListener('click', addProduct);
  //* When we click on 'empty cart'
  emptyCarButtton.addEventListener('click', emptyCart);
  //* We excecute when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    cartElementsHTML();
  })
  //* When we press the boton 'view details'
  productsList.addEventListener('click', modalProduct);
  //* When we click on the X
  modalContainer.addEventListener('click', closeModal);
}
function getProduct() {
  axios.get(baseUrl)
    .then(function (response) {
      const products = response.data
      printProducts(products)
    })
    .catch(function(error){
      console.log(error)
    })
}
getProduct()
function printProducts(products) {
  let html = '';
  for(let i = 0; i < products.length; i++){
    html += `
    <div class='product__container'>
      <div  class='product__container__img'>
        <img src='${products[i].image}'alt='image'>
      </div>
      <div class='product__container__name'>
        <p>${products[i].name}</p>
      </div>
      <div class='product__container__price'>
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class='button'>
        <button class='car__button add__to__car' id='add__to__car' data-id='$ ${products[i].id}'>Add to car</button>
          <button class='product__details'>View Details</button>
      </div>
    </div>
    ` 
  }
  productsList.innerHTML = html
}
//* add products to the shopping cart
//* 1. Capture product info when we click on it
function addProduct(event) {
  if(event.target.classList.contains('add__to__car')){
    // .contains validates if the element exist inside the class
    // .parentElement help us to acced to the inmediate father from the element
    const product = event.target.parentElement.parentElement
    console.log(product)
    cartProductsElements(product)
  }
}
//* 2. We have to transform the HTML info to an array of objects
//* 2.1. I have to validate if the selected element in on the cart already, if existe I should add one unity in that way will no be repeated
function cartProductsElements(product) {
  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
    // .textContent allow us to ask for the text that the element contains
    quantity: 1
  }
  //* Add a counter
  //* If inside car product exist the same id at the one the we have previously at inforProduct, then we add 1 to that quatity
  // some, validates if one of the elements exist inside the array that qualifies for the condition
  if(cartProducts.some(product => product.id === infoProduct.id)){
    // if the product the we click in infoProduct already exist in cartProducts, then:
    const product = cartProducts.map(product => {
      // I have a product that already exist inside cartProduct, then I should add una unity to the quantity to the same element
      if(product.id === infoProduct.id){
        product.quantity++;
        return product;
      } else {
        return product;
      }
    }) 
    cartProducts = [...product]
  } else {
    cartProducts = [...cartProducts, infoProduct]
  }
  console.log(cartProducts)
  cartElementsHTML()
} 
//* 3. I should color, draw or show on screen the product inside the cart
function cartElementsHTML() {
  //! Each time that we iterate with forEach we made a new div, we should depurate the duplicates restarting the container cartList with HTML empty. This deletes all the repeted and iterate above the elements updated on the array from cartProduct
  cartList.innerHTML = "";
  cartProducts.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class='car__product'>
        <div class='car__product__image'>
          <img src='${product.image}'>
        </div>
        <div class='car__product__description'>
          <p>${product.name}</p>
          <p>Precio Total: $ ${(parseFloat(product.price.replace(/[^0-9.-]+/g,""))*product.quantity).toFixed(2)}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class='car__product__button'>
          <button class='delete__product' data-id='${product.id}'>
            Delete
          </button>
        </div>
      </div>
      <hr>
    `;
    // Delete bottom
    cartList.appendChild(div);
    div.querySelector('.delete__product').addEventListener('click',     function(event) {
      const productId = event.target.getAttribute('data-id');
      removeProductFromCart(productId);
      cartElementsHTML();
    })
  });
  productStorage()
}
function removeProductFromCart(productId) {
  cartProducts = cartProducts.filter(product => product.id !== productId);
}
//* Local storage
function productStorage() {
  localStorage.setItem('cart', JSON.stringify(cartProducts))
}
// Delete all elements
function emptyCart() {
  cartProducts = [];
  cartElementsHTML();
}
// Modal window
function modalProduct(event) {
  if(event.target.classList.contains('product__details')){
    modalContainer.classList.add('show__modal')
    const product = event.target.parentElement.parentElement
    modalDetailsElement(product)
  }
}
function closeModal(event) {
  if(event.target.classList.contains('icon__modal')){
    modalContainer.classList.remove('show__modal')
    modalDetailsElement.innerHTML = '';
    modalDetails = []
  }
}
function modalDetailsElement(product) {
  const infoDetails = [{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
  }]
  modalDetails = [...infoDetails]  
}

// Guardar informacion en local storage
// localStorage.setItem('apellido', 'Freire')

// console.log(localStorage.getItem('apellido'))
// const usuario = {
//   name: 'Jhonnatan',
//   age: 28
// }
// localStorage.setItem('usuario', JSON.stringify(usuario))

// const usuarioLocal = localStorage.getItem('usuario')
// console.log(JSON.parse(usuarioLocal))