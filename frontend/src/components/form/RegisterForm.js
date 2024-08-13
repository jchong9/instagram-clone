import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import axios from "axios";

export default function RegisterForm() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      bio: "",
      following: [],
      followers: []
    },
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));
      let result = await axios.post("http://localhost:5000/register", values);
      if (result.data.username) {
        localStorage.setItem("user", JSON.stringify(result.data));
        navigate('/');
      }
      else {
        alert("Already exists");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label>Enter a username: </label>
        <input type="text"
               placeholder="Username*"
               className="form-control"
               id="username"
               name="username"
               onChange={formik.handleChange}
               value={formik.values.username}
        />
      </div>
      <div className="form-group my-3">
        <label>Enter your email: </label>
        <input type="text"
               placeholder="Email*"
               className="form-control"
               id="email"
               name="email"
               onChange={formik.handleChange}
               value={formik.values.email}
        />
      </div>
      <div className="form-group my-3">
        <label>Enter your password: </label>
        <input type="password"
               placeholder="Password*"
               className="form-control"
               id="password"
               name="password"
               onChange={formik.handleChange}
               value={formik.values.password}
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}