import axios from "axios";

export const login = async (obj) => {
  try {
    const val = await axios.post(`127.0.0.1:3000/api/v1/user/login`, obj);
    console.log(val);
  } catch (err) {
    console.log(err);
  }
};
