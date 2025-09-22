import {
  login,
  logout,
  postComment,
  forgotPassword,
  resetPassword,
} from "./login.js";
const loginBtn = document.getElementById("loginBtn");
const logoutBth = document.querySelector(".logout-btn");
const submitComment = document.querySelector(".submit-comment");
const forgotBtn = document.querySelector(".forgotBtn");
const resetBtn = document.querySelector("#resetPassword");

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

if (submitComment) {
  submitComment.addEventListener("click", (e) => {
    e.preventDefault();
    const tourId = submitComment.getAttribute("data-tour-id");
    const comment = document.querySelector(".comment-text").value;
    postComment(tourId, { comment });
  });
}

if (forgotBtn) {
  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    forgotBtn.textContent = "processing...";
    const email = document.getElementById("email").value;
    await forgotPassword({ email });
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", async () => {
    resetBtn.textContent = "resetting...";
    const password = document.getElementById("new-password").value;
    const passwordConfirm = document.getElementById("confirm-password").value;
    const link = window.location.href.split("/").at(-1); //get the token from link
    await resetPassword(link, { password, passwordConfirm });
  });
}
