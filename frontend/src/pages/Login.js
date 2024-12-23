import {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import LoginForm from "../components/form/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, []);

  return (
    <div className="center-relative">
      <div className="registration-container">
        <h1>Login</h1>
        <h4>Continue your journey today</h4>
        <LoginForm/>
        <span>Don't have an account? </span>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}