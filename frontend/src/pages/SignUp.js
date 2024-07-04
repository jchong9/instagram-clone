import {useState} from 'react';
import {useNavigate} from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser() {
    console.warn(name, email, password);
    let result = await fetch("http://localhost:5000/register", {
      method: 'post',
      body: JSON.stringify({name, email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    console.warn(result);
    localStorage.setItem("user", JSON.stringify(result));
    navigate('/');
  }

  return (
    <div className="container-fluid text-center m-auto">
      <h1>Don't have an account?</h1>
      <h4>Sign up today</h4>
      <input type="text"
             placeholder="Enter your name"
             className="mb-3"
             required
             value={name || ""}
             onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input type="text"
             placeholder="Enter your email"
             className="mb-3"
             required
             value={email || ""}
             onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input type="password"
             placeholder="Enter your password"
             className="mb-3"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br />
      <button type="submit" className="signupBtn" onClick={registerUser}>Sign up</button>
    </div>
  );
}