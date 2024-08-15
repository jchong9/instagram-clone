import {useNavigate} from "react-router-dom";
import {Form, Formik} from "formik";
import axios from "axios";
import CustomInput from "../ui/CustomInput";
import {loginSchema} from "../../schemas/loginSchema";

export default function LoginForm() {
  const navigate = useNavigate();

  async function loginUser(values, actions) {
    const result = await axios.post("http://localhost:5000/login", values);
    localStorage.setItem("user", JSON.stringify(result.data));
    actions.resetForm();
    navigate('/');
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={loginSchema}
      validateOnChange={false}
      onSubmit={loginUser}
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
            label="Password"
            name="password"
            type="password"
            placeholder="Password*"
          />
          <button disabled={isSubmitting} type="submit" className="btn btn-primary form-control my-2">Submit</button>
        </Form>
      )}
    </Formik>
  );
}