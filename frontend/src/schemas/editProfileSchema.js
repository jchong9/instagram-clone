import * as yup from 'yup';
import axios from "axios";

export const editProfileSchema = yup.object().shape({
  username: yup.string()
    .test("username", "Username is already taken",  async (value) => {
      const { data } = await axios.get("http://localhost:5000/get-username", {
        params: {username: value}
      });
      return !data;
    }),
  bio: yup.string(),
});