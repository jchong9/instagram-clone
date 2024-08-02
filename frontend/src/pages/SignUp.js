import { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const bio = "";
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, []);

  async function registerUser() {
    let result = await fetch("http://localhost:5000/register", {
      method: 'post',
      body: JSON.stringify({name, email, password, bio}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    localStorage.setItem("user", JSON.stringify(result));
    navigate('/');
  }

  return (
    <div className="container-fluid text-center m-auto">
      <h1>Create an account</h1>
      <h4>Start sharing pictures today</h4>
      <input type="text"
             placeholder="Username*"
             className="mb-3"
             maxLength="20"
             minLength="4"
             required
             value={name || ""}
             onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input type="text"
             placeholder="Email*"
             className="mb-3"
             required
             value={email || ""}
             onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input type="password"
             placeholder="Password*"
             className="mb-3"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br />
      <button className="signupBtn" onClick={registerUser}>Submit</button>
      <br />
      <span>Already have an account? </span>
      <Link to="/login">Log in</Link>
    </div>
  );
}