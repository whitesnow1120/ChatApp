import axios from "axios";
import settings from "../config/settings";

/**
 * Login
 * @param { Object } data (username, password)
 * @method POST
 */
export const login = async (data) => {
  try {
    return await axios.post(settings.URL + "/users/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return err.response;
  }
};

/**
 * Register
 * @param { Object } data (name, username, password)
 * @method POST
 */
export const register = async (data) => {
  try {
    return await axios.post(settings.URL + "/users/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return err.response;
  }
};
