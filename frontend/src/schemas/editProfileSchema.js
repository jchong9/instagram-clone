import * as yup from 'yup';
import axios from "axios";
import {API} from "../utils/constants";

export const editProfileSchema = yup.object().shape({
  username: yup.string()
    .test("username", "Username is already taken",  async (value) => {
      const apiURL = API.baseURL;
      const { data } = await axios.get(`${apiURL}/users/${value}`);
      return !data;
    }),
  bio: yup.string(),
});