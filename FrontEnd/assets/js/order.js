// پیدا کردن همه دکمه‌ها به صورت خودکار
const copyButtons = document.querySelectorAll('[id^="button-copy"]');
// تابع کپی
function copyklip(button) {
  const originalText = button.textContent;
  navigator.clipboard.writeText(originalText);
  button.textContent = "کپی شد !";
  button.style.color = "rgb(9,176,206)";
  setTimeout(() => {
    button.textContent = originalText;
    button.style.color = "#fff";
  }, 700);
}
// اضافه کردن ایونت به همه دکمه‌ها
copyButtons.forEach((button) => {
  button.addEventListener("click", () => copyklip(button));
}); // داده‌های نمونه
const foodItems = [
  { id: 1, name: "کباب کوبیده", price: 120000, category: "main-food" },
  { id: 2, name: "جوجه کباب", price: 100000, category: "main-food" },
  { id: 3, name: "قیمه", price: 80000, category: "main-food" },
  { id: 4, name: "چلو ماهی", price: 150000, category: "main-food" },
  { id: 5, name: "بستنی", price: 25000, category: "desert" },
  { id: 6, name: "حلوا", price: 20000, category: "desert" },
  { id: 7, name: "شیرینی", price: 15000, category: "desert" },
  { id: 8, name: "نوشابه", price: 15000, category: "drink" },
  { id: 9, name: "دوغ", price: 10000, category: "drink" },
  { id: 10, name: "آب معدنی", price: 5000, category: "drink" },
];
// مثال سفارش‌های قبلی
const previousOrders = {
  "main-food": [
    { name: "کباب کوبیده", price: 120000, quantity: 2 },
    { name: "جوجه کباب", price: 100000, quantity: 1 },
  ],
  desert: [
    { name: "بستنی", price: 25000, quantity: 3 },
    { name: "حلوا", price: 20000, quantity: 1 },
  ],
  drink: [
    { name: "نوشابه", price: 15000, quantity: 2 },
    { name: "دوغ", price: 10000, quantity: 1 },
  ],
};
// سایدبار
let currentOrder = {
  "main-food": [],
  desert: [],
  drink: [],
};
// وضعیت فیلتر
let currentFilter = "all";
// تنظیمات تم و لوکال استوریج
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute("title", "فعال کردن تم روشن");
  }
}
// نمایش نوتیفیکیشن اضافه شدن در سبد خرید
function showNotification(message, type = "info") {
  // ایجاد استایل برای نوتیفیکیشن اگر وجود ندارد
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        left: 20px;
        background: var(--bg-card);
        color: var(--text-main);
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        border-left: 4px solid var(--accent);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 3000;
        max-width: 400px;
        font-family: sans;
      } 
      .notification.show {
        transform: translateX(0);
      }      
      .notification-success {
        border-left-color: #10b981;
      }      
      .notification-warning {
        border-left-color: #f59e0b;
      }      
      .notification-info {
        border-left-color: var(--accent);
      }      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      } 
      .notification-content i {
        font-size: 1.2rem;
      }
      .previous-order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        margin-bottom: 8px;
        background: var(--input-bg);
        border-radius: 8px;
        border-left: 3px solid var(--accent);
      } 
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-main);
        grid-column: 1 / -1;
      }  
      .empty-state i {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
        color: var(--accent);
      }
    `;
    document.head.appendChild(style);
  }
  //اضافه به ساید بار و نوتیف
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === "success"
          ? "check"
          : type === "warning"
          ? "exclamation"
          : "info"
      }-circle"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  // انیمیشن ورود
  setTimeout(() => notification.classList.add("show"), 100);
  // حذف خودکار بعد از 3 ثانیه
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
// به روز رسانی وضعیت دکمه های فعال
function updateActiveButtons(selectedCategory) {
  const allButtons = [desertBtn, mainFoodBtn, drinkBtn, allCategoriesBtn];
  allButtons.forEach((btn) => btn.classList.remove("active"));
  switch (selectedCategory) {
    case "desert":
      desertBtn.classList.add("active");
      break;
    case "main-food":
      mainFoodBtn.classList.add("active");
      break;
    case "drink":
      drinkBtn.classList.add("active");
      break;
    case "all":
      allCategoriesBtn.classList.add("active");
      break;
  }
}
// محاسبه تعداد کل آیتم‌ها
function getTotalItems() {
  let total = 0;
  Object.values(currentOrder).forEach((category) => {
    category.forEach((item) => {
      total += item.quantity;
    });
  });
  return total;
}
// به‌روزرسانی آمار آیتم ها
function updateStats() {
  const mainFoodTotal = currentOrder["main-food"].reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const desertTotal = currentOrder["desert"].reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const drinkTotal = currentOrder["drink"].reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  if (mainFoodCount) mainFoodCount.textContent = mainFoodTotal;
  if (desertCount) desertCount.textContent = desertTotal;
  if (drinkCount) drinkCount.textContent = drinkTotal;
  if (sidebarMainCount) sidebarMainCount.textContent = mainFoodTotal;
  if (sidebarDesertCount) sidebarDesertCount.textContent = desertTotal;
  if (sidebarDrinkCount) sidebarDrinkCount.textContent = drinkTotal;
}
// به‌روزرسانی قیمت کل
function updateTotalPrice() {
  let total = 0;
  let totalItems = 0;
  Object.values(currentOrder).forEach((category) => {
    category.forEach((item) => {
      total += item.price * item.quantity;
      totalItems += item.quantity;
    });
  });
  if (totalPriceElement)
    totalPriceElement.textContent = `${total.toLocaleString()} تومان`;
  if (sidebarTotalPrice)
    sidebarTotalPrice.textContent = `${total.toLocaleString()} تومان`;
  if (itemCountElement) itemCountElement.textContent = totalItems;
  if (cartBadge) cartBadge.textContent = totalItems;
  if (submitOrderBtn) submitOrderBtn.disabled = totalItems === 0;
}
// افزایش تعداد به ساید بار
function increaseQuantity(id, category) {
  const item = foodItems.find((food) => food.id === id);
  const existingItem = currentOrder[category].find((order) => order.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    currentOrder[category].push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  }
  //نمایش نوتیف اصلی
  showNotification(`"${item.name}" به سبد خرید اضافه شد`, "success");
  renderFoodItems(currentFilter);
}
// کاهش تعداد
function decreaseQuantity(id, category) {
  const existingItem = currentOrder[category].find((order) => order.id === id);
  const item = foodItems.find((food) => food.id === id);
  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity <= 0) {
      currentOrder[category] = currentOrder[category].filter(
        (order) => order.id !== id
      );
      //نوتیف حذف از سایدبار
      showNotification(`"${item.name}" از سبد خرید حذف شد`, "info");
    }
  }
  renderFoodItems(currentFilter);
}
// حذف آیتم
function removeItem(id, category) {
  const item = foodItems.find((food) => food.id === id);
  currentOrder[category] = currentOrder[category].filter(
    (order) => order.id !== id
  );
  //نوتیف حذف از سایدبار
  showNotification(`"${item.name}" از سبد خرید حذف شد`, "info");
  renderFoodItems(currentFilter);
}
// ایجاد آیتم سایدبار
function createSidebarItem(item) {
  const orderItem = document.createElement("div");
  orderItem.className = "order-item-sidebar";
  orderItem.innerHTML = `
    <div class="order-item-info">
      <div class="order-item-name">${item.name}</div>
      <div class="order-item-details">
        <span class="order-item-quantity">${item.quantity} عدد</span>
        <span class="order-item-price">${(
          item.price * item.quantity
        ).toLocaleString()} تومان</span>
      </div>
    </div>
    <div class="order-item-actions">
      <button class="sidebar-quantity-btn decrease-sidebar" data-id="${
        item.id
      }" data-category="${item.category}">
        <i class="fas fa-minus"></i>
      </button>
      <button class="sidebar-quantity-btn increase-sidebar" data-id="${
        item.id
      }" data-category="${item.category}">
        <i class="fas fa-plus"></i>
      </button>
      <button class="sidebar-remove-btn" data-id="${item.id}" data-category="${
    item.category
  }">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  // ایونت‌ها
  orderItem
    .querySelector(".increase-sidebar")
    .addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("button").dataset.id);
      const category = e.target.closest("button").dataset.category;
      increaseQuantity(id, category);
    });
  orderItem
    .querySelector(".decrease-sidebar")
    .addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("button").dataset.id);
      const category = e.target.closest("button").dataset.category;
      decreaseQuantity(id, category);
    });
  orderItem
    .querySelector(".sidebar-remove-btn")
    .addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("button").dataset.id);
      const category = e.target.closest("button").dataset.category;
      removeItem(id, category);
    });
  return orderItem;
}
// به‌روزرسانی سایدبار
function updateSidebar() {
  const sidebarMainFood = document.getElementById("sidebar-main-food");
  const sidebarDesert = document.getElementById("sidebar-desert");
  const sidebarDrink = document.getElementById("sidebar-drink");
  if (sidebarMainFood) sidebarMainFood.innerHTML = "";
  if (sidebarDesert) sidebarDesert.innerHTML = "";
  if (sidebarDrink) sidebarDrink.innerHTML = "";
  let hasItems = false;
  // پر کردن غذای اصلی
  if (currentOrder["main-food"].length > 0) {
    hasItems = true;
    currentOrder["main-food"].forEach((item) => {
      const orderItem = createSidebarItem(item);
      if (sidebarMainFood) sidebarMainFood.appendChild(orderItem);
    });
  }
  // پر کردن دسر
  if (currentOrder["desert"].length > 0) {
    hasItems = true;
    currentOrder["desert"].forEach((item) => {
      const orderItem = createSidebarItem(item);
      if (sidebarDesert) sidebarDesert.appendChild(orderItem);
    });
  }
  // پر کردن نوشیدنی
  if (currentOrder["drink"].length > 0) {
    hasItems = true;
    currentOrder["drink"].forEach((item) => {
      const orderItem = createSidebarItem(item);
      if (sidebarDrink) sidebarDrink.appendChild(orderItem);
    });
  }
  if (emptyCart) emptyCart.style.display = hasItems ? "none" : "block";
  updateTotalPrice();
  updateStats();
}
// اضافه کردن ایونت‌ها به دکمه‌ها
function attachEventListeners() {
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      const id = parseInt(button.dataset.id);
      const category = button.dataset.category;
      increaseQuantity(id, category);
    });
  });
  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      const id = parseInt(button.dataset.id);
      const category = button.dataset.category;
      decreaseQuantity(id, category);
    });
  });
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      const id = parseInt(button.dataset.id);
      const category = button.dataset.category;
      removeItem(id, category);
    });
  });
}
// رندر لیست غذاها
function renderFoodItems(category = "all") {
  const foodList = document.getElementById("food-list");
  if (!foodList) return;
  foodList.innerHTML = "";
  const filteredItems =
    category === "all"
      ? foodItems
      : foodItems.filter((item) => item.category === category);
  if (filteredItems.length === 0) {
    foodList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>آیتمی یافت نشد</h3>
        <p>هیچ آیتمی در این دسته‌بندی موجود نیست</p>
      </div>
    `;
    return;
  }
  filteredItems.forEach((item) => {
    const foodItem = document.createElement("div");
    foodItem.className = "food-item";
    const orderItem = currentOrder[item.category].find(
      (order) => order.id === item.id
    );
    const quantity = orderItem ? orderItem.quantity : 0;
    foodItem.innerHTML = `
      <div class="food-info">
        <div class="food-name">${item.name}</div>
        <div class="food-price">${item.price.toLocaleString()} تومان</div>
      </div>
      <div class="food-actions">
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-id="${
            item.id
          }" data-category="${item.category}" ${
      quantity === 0 ? "disabled" : ""
    }>
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${quantity}</span>
          <button class="quantity-btn increase" data-id="${
            item.id
          }" data-category="${item.category}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        ${
          quantity > 0
            ? `
          <button class="remove-btn" data-id="${item.id}" data-category="${item.category}">
            <i class="fas fa-trash"></i>
            حذف
          </button>
        `
            : ""
        }
      </div>
    `;
    foodList.appendChild(foodItem);
  });
  // اضافه کردن ایونت‌ها
  attachEventListeners();
  updateSidebar();
}
// ریست کردن سفارش
function resetOrder() {
  currentOrder = {
    "main-food": [],
    desert: [],
    drink: [],
  };
  renderFoodItems(currentFilter);
}
// وقتی صفحه لود شد
document.addEventListener("DOMContentLoaded", function () {
  // تعریف المنت‌های DOM
  const themeToggle = document.getElementById("theme-toggle");
  const previousOrdersBtn = document.getElementById("previous-orders");
  const previousOrdersModal = document.getElementById("previous-orders-modal");
  const closeModal = document.getElementById("close-modal");
  const foodList = document.getElementById("food-list");
  const totalPriceElement = document.getElementById("total-price");
  const itemCountElement = document.getElementById("item-count");
  const desertBtn = document.getElementById("desert");
  const mainFoodBtn = document.getElementById("main-food");
  const drinkBtn = document.getElementById("drink");
  const allCategoriesBtn = document.getElementById("all-categories");
  const editProfileBtn = document.getElementById("edit-profile");
  const logoutBtn = document.getElementById("logout");
  const orderSidebar = document.getElementById("order-sidebar");
  const closeSidebar = document.getElementById("close-sidebar");
  const floatingCartBtn = document.getElementById("floating-cart-btn");
  const cartBadge = document.getElementById("cart-badge");
  const sidebarTotalPrice = document.getElementById("sidebar-total-price");
  const submitOrderBtn = document.getElementById("submit-order");
  const emptyCart = document.getElementById("empty-cart");
  // المنت‌های آمار
  const mainFoodCount = document.getElementById("main-food-count");
  const desertCount = document.getElementById("desert-count");
  const drinkCount = document.getElementById("drink-count");
  const sidebarMainCount = document.getElementById("sidebar-main-count");
  const sidebarDesertCount = document.getElementById("sidebar-desert-count");
  const sidebarDrinkCount = document.getElementById("sidebar-drink-count");
  // بررسی اینکه همه المنت‌های ضروری وجود دارند
  if (!themeToggle || !foodList) {
    console.error("برخی از المنت‌های ضروری در DOM یافت نشدند");
    return;
  }
  // تغییر تم
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.body.removeAttribute("data-theme");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute("title", "فعال کردن تم تیره");
      localStorage.setItem("theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      themeToggle.setAttribute("title", "فعال کردن تم روشن");
      localStorage.setItem("theme", "dark");
    }
  });
  // نمایش سفارش‌های قبلی
  if (previousOrdersBtn && previousOrdersModal) {
    previousOrdersBtn.addEventListener("click", () => {
      const previousMainFood = document.getElementById("previous-main-food");
      const previousDesert = document.getElementById("previous-desert");
      const previousDrink = document.getElementById("previous-drink");
      if (previousMainFood) previousMainFood.innerHTML = "";
      if (previousDesert) previousDesert.innerHTML = "";
      if (previousDrink) previousDrink.innerHTML = "";
      // پر کردن غذای اصلی
      previousOrders["main-food"].forEach((item) => {
        const li = document.createElement("li");
        li.className = "previous-order-item";
        li.innerHTML = `
          <span class="order-name">${item.name}</span>
          <span class="order-quantity">${item.quantity} عدد</span>
          <span class="order-price">${(
            item.price * item.quantity
          ).toLocaleString()} تومان</span>
        `;
        if (previousMainFood) previousMainFood.appendChild(li);
      });
      // پر کردن دسر
      previousOrders["desert"].forEach((item) => {
        const li = document.createElement("li");
        li.className = "previous-order-item";
        li.innerHTML = `
          <span class="order-name">${item.name}</span>
          <span class="order-quantity">${item.quantity} عدد</span>
          <span class="order-price">${(
            item.price * item.quantity
          ).toLocaleString()} تومان</span>
        `;
        if (previousDesert) previousDesert.appendChild(li);
      });
      // پر کردن نوشیدنی
      previousOrders["drink"].forEach((item) => {
        const li = document.createElement("li");
        li.className = "previous-order-item";
        li.innerHTML = `
          <span class="order-name">${item.name}</span>
          <span class="order-quantity">${item.quantity} عدد</span>
          <span class="order-price">${(
            item.price * item.quantity
          ).toLocaleString()} تومان</span>
        `;
        if (previousDrink) previousDrink.appendChild(li);
      });
      previousOrdersModal.style.display = "flex";
    });
  }
  // مدیریت سایدبار
  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      if (window.innerWidth <= 1200 && orderSidebar) {
        orderSidebar.classList.remove("active");
      }
    });
  }
  if (floatingCartBtn && orderSidebar) {
    floatingCartBtn.addEventListener("click", () => {
      orderSidebar.classList.add("active");
    });
  }
  // بستن سایدبار با کلیک بیرون
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 1200 &&
      orderSidebar &&
      !orderSidebar.contains(e.target) &&
      floatingCartBtn &&
      !floatingCartBtn.contains(e.target) &&
      orderSidebar.classList.contains("active")
    ) {
      orderSidebar.classList.remove("active");
    }
  });
  // بستن مودال
  if (closeModal && previousOrdersModal) {
    closeModal.addEventListener("click", () => {
      previousOrdersModal.style.display = "none";
    });
  }
  // بستن  با کلیک بیرون
  window.addEventListener("click", (e) => {
    if (e.target === previousOrdersModal) {
      previousOrdersModal.style.display = "none";
    }
  });
  // فیلتر دسته‌بندی نوع غذا
  if (desertBtn) {
    desertBtn.addEventListener("click", () => {
      currentFilter = "desert";
      renderFoodItems("desert");
      updateActiveButtons("desert");
    });
  }
  if (mainFoodBtn) {
    mainFoodBtn.addEventListener("click", () => {
      currentFilter = "main-food";
      renderFoodItems("main-food");
      updateActiveButtons("main-food");
    });
  }
  if (drinkBtn) {
    drinkBtn.addEventListener("click", () => {
      currentFilter = "drink";
      renderFoodItems("drink");
      updateActiveButtons("drink");
    });
  }
  if (allCategoriesBtn) {
    allCategoriesBtn.addEventListener("click", () => {
      currentFilter = "all";
      renderFoodItems("all");
      updateActiveButtons("all");
    });
  }
  // ویرایش پروفایل
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      showNotification("قابلیت ویرایش پروفایل به زودی اضافه خواهد شد", "info");
    });
  }
  // خروج
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("آیا از خروج از حساب کاربری اطمینان دارید؟")) {
        showNotification("با موفقیت خارج شدید", "success");
      }
    });
  }
  // ثبت سفارش
  if (submitOrderBtn) {
    submitOrderBtn.addEventListener("click", () => {
      const totalItems = getTotalItems();
      if (totalItems === 0) {
        showNotification(
          "لطفاً ابتدا آیتم‌هایی به سبد خرید اضافه کنید",
          "warning"
        );
        return;
      }
      if (confirm("آیا از ثبت سفارش اطمینان دارید؟")) {
        showNotification("سفارش شما با موفقیت ثبت شد!", "success");
        resetOrder();
      }
    });
  }
  // مقداردهی اولیه
  loadTheme();
  renderFoodItems();
  updateActiveButtons("all");
});
// رفتن به تب همه
window.addEventListener("load", function () {
  // تاخیر برای لود کامل
  setTimeout(() => {
    const allCategoriesBtn = document.getElementById("all-categories");
    if (allCategoriesBtn) {
      // کلیک رو همه
      allCategoriesBtn.click();
    }
  }, 100);
});
