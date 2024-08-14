import * as yup from 'yup';
import axios from "axios";

export const editProfileSchema = yup.object().shape({
  username: yup.string()
    .test("username", "Username is already taken",  async (value) => {
      const result = await axios.get("http://localhost:5000/get-username", {
        params: {username: value}
      });
      return !result.data;
    }),
  bio: yup.string(),
});