import * as yup from 'yup';
import axios from "axios";

export const signupSchema = yup.object().shape({
  username: yup.string()
    .min(3, "Username must be at least 3 characters long!")
    .max(30, "Username must not exceed 30 characters!")
    .required("Required!")
    .test("username", "Username already in use",  async (value) => {
      const result = await axios.get("http://localhost:5000/get-username", {
        params: {username: value}
      });
      return !result.data;
    }),
  email: yup.string()
    .email("Invalid email")
    .required("Required!")
    .test("email", "Email already in use", async (value) => {
      const result = await axios.get("http://localhost:5000/get-email", {
        params: {email: value}
      });
      return !result.data;
    }),
  password: yup.string()
    .min(3, "Password must be at least 3 characters long!")
    .required("Required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});