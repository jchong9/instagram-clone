import * as yup from 'yup';
import axios from "axios";

export const signupSchema = yup.object().shape({
  username: yup.string()
    .min(3, "Username must be at least 3 characters long!")
    .max(30, "Username must not exceed 30 characters!")
    .required("Required")
    .test("username", "Username already in use",  async (value) => {
      const usernameExists = await axios.get(`http://localhost:5000/users/${value}`);
      return !usernameExists.data; // If username does exist, we want to return false to trigger the error
    }),
  email: yup.string()
    .email("Invalid email")
    .required("Required!")
    .test("email", "Email already in use", async (value) => {
      const emailExists = await axios.get(`http://localhost:5000/users/${value}`);
      return !emailExists.data;
    }),
  password: yup.string()
    .min(6, "Password must be at least 6 characters long!")
    .required("Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      "Must contain one uppercase, one lowercase, one number and one special character"
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});