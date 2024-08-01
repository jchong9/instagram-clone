import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [email, password]);

  async function loginUser() {
    let result = await fetch("http://localhost:5000/login", {
      method: 'post',
      body: JSON.stringify({email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result.name) {
      localStorage.setItem("user", JSON.stringify(result));
      navigate('/');
    }
    else {
      alert("User does not exist!");
    }
  }

  return (
    <div className="container-fluid text-center m-auto">
      <h1>Welcome back</h1>
      <h4>Login</h4>
      <input type="text"
             placeholder="Email*"
             className="mb-3"
             required
             value={email || ""}
             onChange={(e) => setEmail(e.target.value)}
      />
      <br/>
      <input type="password"
             placeholder="Password*"
             className="mb-3"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br />
      <button type="submit" className="loginBtn" onClick={loginUser}>Submit</button>
      <br />
      <span>Don't have an account? </span>
      <Link to="/signup">Sign up</Link>
    </div>
  );
}