const FEE_PER_KM = 10;

function getCart(){
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount(){
  const count = getCart().length;
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}
function addToCart(name, price){
  const cart = getCart();
  cart.push({ name, price });
  setCart(cart);
  alert(`${name} added to cart!`);
}

function renderCart(){
  updateCartCount();
  const ul = document.getElementById('cart-items');
  if(!ul) return;
  ul.innerHTML = '';
  let sub = 0;
  getCart().forEach((item, idx) => {
    sub += item.price;
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><strong>₱${item.price}</strong>`;
    ul.appendChild(li);
  });
  document.getElementById('subtotal').textContent = sub;
  document.getElementById('grand-total').textContent = sub;
}

function setupCheckout(){
  const btn = document.getElementById('checkout-btn');
  if(!btn) return;
  const modal = document.getElementById('order-modal');
  const closeBtn = document.getElementById('modal-close');
  const pickupBtn = document.getElementById('pickup-btn');
  const deliveryBtn = document.getElementById('delivery-btn');
  const deliveryForm = document.getElementById('delivery-form');
  const confirmDelivery = document.getElementById('confirm-delivery');
  const modalTotal = document.getElementById('modal-total');
  const deliveryWrap = document.getElementById('delivery-fee-wrap');
  const deliveryFeeEl = document.getElementById('delivery-fee');
  const grandTotalEl = document.getElementById('grand-total');
  const placeOrderBtn = document.getElementById('place-order');

  const open = ()=> modal.classList.remove('hidden');
  const close = ()=> modal.classList.add('hidden');

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  pickupBtn.addEventListener('click', ()=>{
    deliveryForm.classList.add('hidden');
    deliveryWrap.classList.add('hidden');
    deliveryFeeEl.textContent = '0';
    modalTotal.textContent = `Final Total: ₱${grandTotal()}`;
  });

  deliveryBtn.addEventListener('click', ()=>{
    deliveryForm.classList.remove('hidden');
  });

  confirmDelivery.addEventListener('click', ()=>{
    const km = Math.max(1, parseInt(document.getElementById('distance').value || '1', 10));
    const fee = km * FEE_PER_KM;
    const final = grandTotal() + fee;
    deliveryWrap.classList.remove('hidden');
    deliveryFeeEl.textContent = fee;
    grandTotalEl.textContent = final;
    modalTotal.textContent = `Delivery Fee: ₱${fee} • Final Total: ₱${final}`;
  });

  placeOrderBtn.addEventListener('click', ()=>{
    alert('Order placed! Thank you.');
    setCart([]);
    window.location.href = 'index.html';
  });

  modalTotal.textContent = `Final Total: ₱${grandTotal()}`;
}

function grandTotal(){
  return getCart().reduce((sum, it)=> sum + (it.price||0), 0);
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  renderCart();
  setupCheckout();
});
