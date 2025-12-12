
<!-- File: script.js -->
// Shared cart logic (localStorage)
(function(){
  // Utilities
  function getCart(){
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  function saveCart(c){
    localStorage.setItem('cart', JSON.stringify(c));
    updateCartCount();
  }
  function addToCart(item){
    const c = getCart();
    const existing = c.find(x=>x.id==item.id);
    if (existing) existing.qty += 1; else c.push({...item,qty:1});
    saveCart(c);
  }
  function removeFromCart(id){
    let c = getCart();
    c = c.filter(x=>x.id!=id);
    saveCart(c);
  }
  function updateCartCount(){
    const c = getCart();
    const count = c.reduce((s,i)=>s+i.qty,0);
    const el = document.getElementById('cart-count');
    const el2 = document.getElementById('cart-count-2');
    if (el) el.textContent = count;
    if (el2) el2.textContent = count;
  }
  function renderCart(modalId, itemsContainerId, totalId){
    const modal = document.getElementById(modalId);
    const itemsEl = document.getElementById(itemsContainerId);
    const totalEl = document.getElementById(totalId);
    const c = getCart();
    if (!itemsEl) return;
    if (c.length===0){
      itemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
      totalEl.textContent = '0';
      return;
    }
    itemsEl.innerHTML = '';
    let total = 0;
    c.forEach(it=>{
      total += it.price * it.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<div><strong>${it.title}</strong> <div class="muted" style="font-size:13px">₹${it.price} × ${it.qty}</div></div><div><button class="btn small remove" data-id="${it.id}">Remove</button></div>`;
      itemsEl.appendChild(div);
    });
    totalEl.textContent = total;

    // remove buttons
    itemsEl.querySelectorAll('.remove').forEach(b=>{
      b.addEventListener('click', ()=>{ removeFromCart(b.dataset.id); renderCart(modalId, itemsContainerId, totalId); });
    });
  }

  // Generic open/close for cart modals
  window.openCart = function(modalId){
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.setAttribute('aria-hidden','false');
    if (modalId==='cartModal') renderCart('cartModal','cartItems','cartTotal');
    if (modalId==='cartModal2') renderCart('cartModal2','cartItems2','cartTotal2');
  }
  function closeCart(modalId){
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.setAttribute('aria-hidden','true');
  }

  // Wire up cart buttons if present
  document.addEventListener('DOMContentLoaded', ()=>{
    updateCartCount();
    const btn = document.getElementById('cartBtn');
    if (btn) btn.addEventListener('click', ()=> openCart('cartModal'));
    const close = document.getElementById('closeCart');
    if (close) close.addEventListener('click', ()=> closeCart('cartModal'));

    const btn2 = document.getElementById('cartBtn2');
    if (btn2) btn2.addEventListener('click', ()=> openCart('cartModal2'));
    const close2 = document.getElementById('closeCart2');
    if (close2) close2.addEventListener('click', ()=> closeCart('cartModal2'));

    const checkout = document.getElementById('checkout');
    if (checkout) checkout.addEventListener('click', ()=> alert('Checkout not implemented in demo'));
    const checkout2 = document.getElementById('checkout2');
    if (checkout2) checkout2.addEventListener('click', ()=> alert('Checkout not implemented in demo'));

    // Allow clicking outside modal to close
    document.querySelectorAll('.modal').forEach(m=>{
      m.addEventListener('click', (e)=>{ if (e.target===m) m.setAttribute('aria-hidden','true'); });
    });

    // If page contains buttons with data-add-to-cart (index could link to specific book demo)
    document.querySelectorAll('[data-add-to-cart]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const it = {id:b.dataset.id,title:b.dataset.title,price:Number(b.dataset.price)};
        addToCart(it);
        openCart('cartModal');
      });
    });
  });

  // Expose addToCart to other inline scripts (catalogue uses it)
  window.addToCart = function(item){ addToCart(item); };
})();
