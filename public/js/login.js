import axios from "axios";

export const login = async (obj) => {
  try {
    const val = await axios.post(`/api/v1/user/login`, obj);
    alert("successfully logged in!");
    location.assign("/all");
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};

export const logout = async () => {
  try {
    await axios.post(`/api/v1/user/logout`);
    location.assign("/all");
    alert("logged out!");
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
};
