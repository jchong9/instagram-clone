import { useState } from 'react';
import {Link} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function loginUser() {
    console.warn(email, password);
  }

  return (
    <div className="container-fluid text-center m-auto">
      <h1>Welcome back</h1>
      <h4>Login</h4>
      <input type="text"
             placeholder="Enter your email"
             className="mb-3"
             required
             value={email || ""}
             onChange={(e) => setEmail(e.target.value)}
      />
      <br/>
      <input type="password"
             placeholder="Enter your password"
             className="mb-3"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br />
      <button type="submit" className="loginBtn" onClick={loginUser}>Submit</button>
      <br />
      <Link to="/signup">Don't have an account? Sign up</Link>
    </div>
  );
}