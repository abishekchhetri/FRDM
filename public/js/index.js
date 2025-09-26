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
  deleteaBlog,
  updateaBlog,
  deleteaUser,
  signup,
  search,
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
const deleteBlog = document.querySelector(".card-body");
const updateBlog = document.querySelector(".updateBlog");
const updateRecipe = document.querySelector(".updateRecipe");
const btnDanger = document.querySelector(".btn-danger");
const signUp = document.querySelector("#signupBtn");
const hdrSearchBtn = document.querySelector(".hdr-search-btn");

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
    postBlog.textContent = "Uploading...";
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
    postRecipe.textContent = "Upload Recipe";
  });

if (deleteComment)
  deleteComment.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-cmnt")) return;
    e.target.textContent = "Deleting...";
    await deleteaComment(e.target.dataset.id);
  });

if (deleteBlog)
  deleteBlog.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-outline-primary")) {
      e.target.textContent = "Updating...";
    } else if (e.target.classList.contains("btn-outline-danger")) {
      e.target.textContent = "Deleting...";
      await deleteaBlog(e.target.dataset.id);
    } else return;
  });

// UPDATE RECIPE AND BLOG
if (updateBlog) {
  updateBlog.addEventListener("click", async (e) => {
    updateBlog.textContent = "Uploading...";
    const title = document.querySelector("#blogTitle").value;
    const photo = document.querySelector("#blogPhoto").value;
    const description = document.querySelector("#blogDescription").value;
    const obj = {
      title,
      photo,
      description,
      type: "blog",
    };

    const id = e.target.dataset.id;
    await updateaBlog(obj, id);
    updateBlog.textContent = "Upload Blog";
  });
}
if (updateRecipe)
  updateRecipe.addEventListener("click", async (e) => {
    updateRecipe.textContent = "please wait...";
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
    const id = e.target.dataset.id;
    await updateaBlog(obj, id);
    updateRecipe.textContent = "Upload";
  });

if (btnDanger) {
  btnDanger.addEventListener("click", async (e) => {
    btnDanger.textContent = "Deleting...";
    const id = e.target.dataset.id;
    await deleteaUser(id);
    btnDanger.textContent = "Delete";
  });
}

if (signUp) {
  signUp.addEventListener("click", async () => {
    signUp.textContent = "Signing up...";
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const passwordConfirm = document.querySelector("#passwordConfirm").value;
    const password = document.querySelector("#password").value;
    if (password.length < 8) {
      signUp.textContent = "Sign up";
      alert("password must be atleast 8 characters long");
      return;
    }
    const obj = { name, email, passwordConfirm, password };
    await signup(obj);
    signUp.textContent = "Sign up";
  });
}

if (hdrSearchBtn) {
  hdrSearchBtn.addEventListener("click", () => {
    const searchBar = document.querySelector(".hdr-search-input ").value;
    search(searchBar);
    searchBar.value = "";
  });
}
