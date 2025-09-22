import axios from "axios";

export const login = async (obj) => {
  try {
    const val = await axios.post(`/api/v1/user/login`, obj);
    alert("successfully logged in!");
    location.assign("/");
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};

export const logout = async () => {
  try {
    await axios.post(`/api/v1/user/logout`);
    location.assign("/");
    alert("logged out!");
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};

export const postComment = async (tourId, obj) => {
  try {
    await axios.post(`/api/v1/comment/${tourId}`, obj);
    location.reload(true);
    alert("comment posted!");
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};

export const forgotPassword = async (email) => {
  try {
    await axios.post(`/api/v1/user/forgotPassword`, email);
    alert("reset link has been sent, reset password and login again");
    location.assign("/");
  } catch (err) {
    alert(err.response.data.message);
    location.reload(true);
    console.log(err);
  }
};

export const resetPassword = async (token, obj) => {
  try {
    await axios.patch(`/api/v1/user/resetPassword/${token}`, obj);
    alert("password has been reset!");
    location.assign("/");
  } catch (err) {
    alert(err.response.data.message);
    location.reload("/");
    console.log(err);
  }
};
