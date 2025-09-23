import {
  login,
  logout,
  postComment,
  forgotPassword,
  resetPassword,
  searchUser,
  postaRecipe,
  postaBlog,
  deleteaComment,
} from "./login.js";
const loginBtn = document.getElementById("loginBtn");
const logoutBth = document.querySelector(".logout-btn");
const submitComment = document.querySelector(".submit-comment");
const forgotBtn = document.querySelector(".forgotBtn");
const resetBtn = document.querySelector("#resetPassword");
const searchBtn = document.querySelector("#searchBtn");
const postBlog = document.querySelector(".postBlog");
const postRecipe = document.querySelector(".postRecipe");
const deleteComment = document.querySelector(".comments-section");

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

if (searchBtn) {
  searchBtn.addEventListener("click", async () => {
    const field = document.querySelector("#searchInput").value;
    searchUser(field);
  });
}
if (postBlog) {
  postBlog.addEventListener("click", async () => {
    postBlog.textContent = "Upload";
    const title = document.querySelector("#blogTitle").value;
    const photo = document.querySelector("#blogPhoto").value;
    const description = document.querySelector("#blogDescription").value;
    const obj = {
      title,
      photo,
      description,
      type: "blog",
    };
    await postaBlog(obj);
    postBlog.textContent = "Upload Blog";
  });
}
if (postRecipe)
  postRecipe.addEventListener("click", async () => {
    postRecipe.textContent = "please wait...";
    const title = document.querySelector("#recipeTitle").value;
    const photo = document.querySelector("#recipePhoto").value;
    const description = document.querySelector("#recipeDescription").value;
    const howToCook = document.querySelector("#howToCook").value;
    const ingredients = document.querySelector("#ingredients").value;
    const time = document.querySelector("#time").value;
    const calories = document.querySelector("#calories").value;
    const obj = {
      title,
      photo,
      description,
      howToCook,
      ingredients,
      time,
      calories,
      type: "recipe",
    };
    await postaRecipe(obj);
    postRecipe.textContent = "Upload";
  });

if (deleteComment)
  deleteComment.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-cmnt")) return;
    e.target.textContent = "Deleting...";
    await deleteaComment(e.target.dataset.id);
  });
