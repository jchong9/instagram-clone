import {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import RegisterForm from "../components/form/RegisterForm";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, []);

  return (
    <div className="center">
      <div className="registration-container">
        <h1>Create an account</h1>
        <h4>Start sharing pictures today</h4>
        <RegisterForm/>
        <span>Already have an account? </span>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}