import * as yup from 'yup';
import axios from "axios";
import {API} from "../utils/constants";

export const loginSchema = yup.object().shape({
  username: yup.string()
    .required("Required")
    .test("username", "Username does not exist",  async (value) => {
      const apiURL = API.baseURL;
      const { data } = await axios.get(`${apiURL}/users/${value}`);
      return data;
    }),
  password: yup.string()
    .required("Required"),
});