// انتخاب عناصر
const show = document.getElementById("show");
const btn = document.getElementById("btn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const themeToggle = document.getElementById("theme-toggle");

// داده‌های ورود
const userdata = "admin";
const passdata = "1234";

// بررسی تم ذخیره شده در localStorage و مقداردهی اولیه آیکون تم
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
if (themeToggle) {
  // اگر تم تاریک هست، آیکون خورشید نشون میدیم (برای رفتن به لایت)
  themeToggle.innerHTML =
    savedTheme === "dark"
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
}

// جلوگیری از ارسال فرم با Enter (در صورتی که فرم وجود داشته باشد)
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => e.preventDefault());
}

// 🔐 تغییر نمایش رمز
if (show && password) {
  show.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";

    // تنظیم آیکون چشم
    show.classList.toggle("fa-eye");
    show.classList.toggle("fa-eye-slash");
  });
}

// 🚫 بررسی ورود
if (btn) {
  btn.addEventListener("click", () => {
    let valid = true;

    if (username.value !== userdata) {
      username.classList.add("borderred");
      valid = false;
    } else username.classList.remove("borderred");

    if (password.value !== passdata) {
      password.classList.add("borderred");
      valid = false;
    } else password.classList.remove("borderred");

    if (valid) alert("ورود موفقیت‌آمیز ✅");
    password.value = "";
    username.value = "";
  });
}

// 🌙 تغییر تم (روشن / تیره)
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);

    // ذخیره تم جدید در localStorage
    localStorage.setItem("theme", newTheme);

    // تغییر آیکون (وقتی تیره است، نمایش خورشید برای رفتن به لایت و برعکس)
    themeToggle.innerHTML =
      newTheme === "dark"
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
  });
}

// جلوگیری از تایپ فارسی (حروف و اعداد فارسی)
function preventPersianInput(event) {
  const regex = /[\u0600-\u06FF\u06F0-\u06F9]/; // حروف و اعداد فارسی

  if (regex.test(event.key)) {
    alert("لطفا اعداد را به انگلیسی وارد کنید !");
    event.preventDefault(); // جلوگیری از تایپ فارسی
  }
}

// ===== مدیریت کلید Enter در اینپوت‌ها =====
// در username: Enter => فوکس به password
if (username) {
  username.addEventListener("keydown", (e) => {
    // اول از همه، بررسی کاراکتر فارسی
    if (e.key && e.key.length === 1) preventPersianInput(e);

    if (e.key === "Enter") {
      e.preventDefault(); // جلوگیری از رفتار پیش‌فرض (مثل submit یا کلیک روی اولین دکمه)
      if (password) password.focus();
    }
  });
}

// در password: Enter => کلیک روی btn
if (password) {
  password.addEventListener("keydown", (e) => {
    // بررسی کاراکتر فارسی
    if (e.key && e.key.length === 1) preventPersianInput(e);

    if (e.key === "Enter") {
      e.preventDefault();
      if (btn) btn.click();
    }
  });
}
