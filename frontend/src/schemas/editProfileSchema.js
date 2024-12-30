import * as yup from 'yup';
import axios from "axios";

export const editProfileSchema = yup.object().shape({
  username: yup.string()
    .test("username", "Username is already taken",  async (value) => {
      const apiURL = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${apiURL}/users/${value}`);
      return !data;
    }),
  bio: yup.string(),
});