// متغیر ها
const show = document.getElementById("show");
const btn = document.getElementById("btn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const themeToggle = document.getElementById("theme-toggle");
const loginLink = document.getElementById("login-link");
//تست
const userdata = "admin";
const passdata = "1234";
// بررسی تم و مقدار دهی اتریبیوت
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
if (themeToggle) {
  themeToggle.innerHTML =
    savedTheme === "dark"
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
}
//  تغییر تایپ پسوورد
if (show && password) {
  show.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    // آیکون چشم
    show.classList.toggle("fa-eye");
    show.classList.toggle("fa-eye-slash");
  });
}
function validateForm() {
  const isUsernameValid = username.value === userdata;
  const isPasswordValid = password.value === passdata;
  if (isUsernameValid && isPasswordValid) {
    btn.disabled = false;
    loginLink.removeEventListener("click", preventDefaultAction);
  } else {
    btn.disabled = true;
    loginLink.addEventListener("click", preventDefaultAction);
  }
}
// عمل نکردن تگ a
function preventDefaultAction(event) {
  event.preventDefault();
}
// اعتبار سنجی
if (username && password) {
  username.addEventListener("input", validateForm);
  password.addEventListener("input", validateForm);
}
// بررسی نام و رمز
if (btn) {
  btn.addEventListener("click", (e) => {
    let valid = true;
    if (username.value !== userdata) {
      username.classList.add("borderred");
      valid = false;
    } else {
      username.classList.remove("borderred");
    }
    if (password.value !== passdata) {
      password.classList.add("borderred");
      valid = false;
    } else {
      password.classList.remove("borderred");
    }
    if (valid) {
      alert("ورود موفقیت‌آمیز ✅");
    }
  });
}
// تغییر تم
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    // دخیره تم
    localStorage.setItem("theme", newTheme);
    //آیکون تم
    themeToggle.innerHTML =
      newTheme === "dark"
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
  });
}
// انگلیسی نوشتن
function preventPersianInput(event) {
  const regex = /[\u0600-\u06FF\u06F0-\u06F9]/;
  if (regex.test(event.key)) {
    alert("لطفا اعداد را به انگلیسی وارد کنید !");
    event.preventDefault();
  }
}
//اینتر
if (username) {
  username.addEventListener("keydown", (e) => {
    if (e.key && e.key.length === 1) preventPersianInput(e);
    if (e.key === "Enter") {
      e.preventDefault();
      if (password) password.focus();
    }
  });
}
//انگلیسی بودن
if (password) {
  password.addEventListener("keydown", (e) => {
    if (e.key && e.key.length === 1) preventPersianInput(e);
    if (e.key === "Enter") {
      e.preventDefault();
      if (btn && !btn.disabled) btn.click();
    }
  });
}
validateForm();
