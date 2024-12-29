import * as yup from 'yup';
import axios from "axios";

export const loginSchema = yup.object().shape({
  username: yup.string()
    .required("Required")
    .test("username", "Username does not exist",  async (value) => {
      const { data } = await axios.get(`http://localhost:5000/users/${value}`);
      return data;
    }),
  password: yup.string()
    .required("Required"),
});