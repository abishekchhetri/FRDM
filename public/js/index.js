import { login, logout } from "./login.js";
const loginBtn = document.getElementById("loginBtn");
const logoutBth = document.querySelector(".logout-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    //login operation here
    login({ email, password });
  });
}

if (logoutBth) {
  logoutBth.addEventListener("click", () => {
    logout();
  });
}
