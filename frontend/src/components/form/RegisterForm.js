import {useNavigate} from "react-router-dom";
import {Form, Formik} from "formik";
import axios from "axios";
import {signupSchema} from "../../schemas/signupSchema";
import CustomInput from "../ui/CustomInput";

export default function RegisterForm() {
  const navigate = useNavigate();

  async function signupUser(values, actions) {
    delete values.confirmPassword;
    values.bio = "";
    values.following = [];
    values.followers = [];
    const result = await axios.post("http://localhost:5000/register", values);
    localStorage.setItem("user", JSON.stringify(result.data));
    actions.resetForm();
    navigate('/');
  }

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={signupSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={signupUser}
    >
      {({isSubmitting}) => (
        <Form>
          <CustomInput
            label="Username"
            name="username"
            type="text"
            placeholder="Username*"
          />
          <CustomInput
            label="Email"
            name="email"
            type="email"
            placeholder="Email*"
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password*"
          />
          <CustomInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password*"
          />
          <button disabled={isSubmitting} type="submit" className="btn btn-primary form-control my-2">Submit</button>
        </Form>
      )}
    </Formik>
  );
}