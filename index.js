const productsData = [
  {
    id: 1,
    title: "Basic T-Shirt",
    price: 25.0,
    image:"Assets/Basic T-Shirt.jpg",
    tag: "New Arrival",
  },
  {
    id: 2,
    title: "Denim Jacket",
    price: 85.0,
    image:"Assets/Denim Jacket.jpg",
    tag: "Best Seller",
  },
  {
    id: 3,
    title: "Leather Sneakers",
    price: 120.0,
    image:"Assets/Leather Sneakers.jpg",
    tag: "Offer",
  },
  {
    id: 4,
    title: "Summer Hat",
    price: 35.0,
    image:"Assets/Summer Hat.jpg",
    tag: "New Arrival",
  },
  {
    id: 5,
    title: "Smart Watch",
    price: 199.0,
    image:"Assets/Smart Watch.jpg",
    tag: "Best Seller",
  },
  {
    id: 6,
    title: "Running Shoes",
    price: 95.0,
    image:"Assets/Running Shoes.jpg",
    tag: "Offer",
  },
  {
    id: 7,
    title: "Backpack",
    price: 60.0,
    image:"Assets/Backpack.jpg",
    tag: "New Arrival",
  },
  {
    id: 8,
    title: "Sunglasses",
    price: 45.0,
    image:"Assets/Sunglasses.jpg",
    tag: "Best Seller",
  },
];

let cart = JSON.parse(localStorage.getItem("shopWaveCart")) || [];

function saveCart() {
  localStorage.setItem("shopWaveCart", JSON.stringify(cart));
  updateCartCount();
}

function navigateTo(pageId) {
  const routes = {
    home: "index.HTML",
    products: "Products.HTML",
    cart: "Cart.HTML",
    login: "Login.HTML",
  };

  // If we are already on the page, do nothing (optional optimization)
  if (window.location.pathname.includes(routes[pageId])) return;

  if (routes[pageId]) {
    window.location.href = routes[pageId];
  }
}

function createProductCard(product) {
  return `
          <div class="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition duration-300 flex flex-col h-full">
              <div class="relative overflow-hidden h-64">
                  <img class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" src="${
                    product.image
                  }" alt="${product.title}">
                  <div class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow">${
                    product.tag
                  }</div>
              </div>
              <div class="p-4 flex flex-col flex-grow">
                  <h3 class="text-lg font-bold text-gray-800 mb-1">${
                    product.title
                  }</h3>
                  <p class="text-primary font-semibold mb-4">$${product.price.toFixed(
                    2
                  )}</p>
                  <div class="mt-auto flex gap-2">
                      <button onclick="addToCart(${
                        product.id
                      })" class="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-primary hover:scale-105 transition duration-200 transform text-sm font-medium">
                          Add to Cart
                      </button>
                      <button onclick="navigateTo('products')" class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-gray-600">
                          <i class="fa-solid fa-eye"></i>
                      </button>
                  </div>
              </div>
          </div>
      `;
}

function renderProducts() {
  const homeGrid = document.getElementById("home-products-grid");
  const allGrid = document.getElementById("all-products-grid");

  // Only render if the element exists on the current page
  if (homeGrid) {
    homeGrid.innerHTML = productsData
      .slice(0, 4)
      .map(createProductCard)
      .join("");
  }

  if (allGrid) {
    allGrid.innerHTML = productsData.map(createProductCard).join("");
  }
}

function addToCart(productId) {
  const product = productsData.find((p) => p.id === productId);
  cart.push(product);
  saveCart(); // Persist to storage

  // Visual feedback
  // Note: event is deprecated in some contexts but works in simple inline handlers.
  // For robustness, consider passing 'this' or the event object explicitly.
  const btn = event ? event.target.closest("button") : null;
  if (btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
    btn.classList.add("bg-green-600", "text-white");
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.classList.remove("bg-green-600", "text-white");
    }, 1000);
  }
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return; // Safety check

  countEl.innerText = cart.length;
  if (cart.length > 0) {
    countEl.classList.remove("scale-0");
    countEl.classList.add("scale-100");
  } else {
    countEl.classList.add("scale-0");
    countEl.classList.remove("scale-100");
  }
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  // Safety check: if we aren't on the cart page, stop here
  if (!container || !subtotalEl || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="p-12 text-center text-gray-500 flex flex-col items-center"><i class="fa-solid fa-basket-shopping text-4xl mb-4 text-gray-300"></i><p>Your cart is empty.</p><button onclick="navigateTo('products')" class="mt-4 text-primary font-medium hover:underline">Start Shopping</button></div>`;
    subtotalEl.innerText = "$0.00";
    totalEl.innerText = "$0.00";
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item, index) => {
      total += item.price;
      return `
              <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  <div class="flex items-center gap-4 w-full sm:w-auto">
                      <img src="${item.image}" alt="${
        item.title
      }" class="w-20 h-20 object-cover rounded-md">
                      <div>
                          <h4 class="font-bold text-gray-800">${item.title}</h4>
                          <p class="text-sm text-gray-500">Ref: 00${item.id}</p>
                      </div>
                  </div>
                  <div class="flex items-center justify-between w-full sm:w-auto gap-8">
                      <span class="font-bold text-primary">$${item.price.toFixed(
                        2
                      )}</span>
                      <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 transition">
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </div>
              </div>
          `;
    })
    .join("");

  subtotalEl.innerText = `$${total.toFixed(2)}`;
  totalEl.innerText = `$${(total + 10).toFixed(2)}`; // + $10 shipping
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart(); // Update storage
  renderCart();
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
}

function handleLogin(e) {
  e.preventDefault();
  alert("Login Successful! Redirecting to Home...");
  navigateTo("home");
}

document.addEventListener("DOMContentLoaded", () => {
  // Update UI based on current data
  updateCartCount();
  renderProducts();
  renderCart();

  // We DO NOT call navigateTo('home') here anymore.
  // The browser handles loading the correct file.
});