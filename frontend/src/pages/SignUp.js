import {useState, useEffect} from 'react';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function registerUser() {
    console.warn(name, email, password);
  }

  return (
    <div>
      <h1>Don't have an account?</h1>
      <h2>Sign up today</h2>
      <input type="text"
             placeholder="Enter your name"
             required
             value={name || ""}
             onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input type="text"
             placeholder="Enter your email"
             required
             value={email || ""}
             onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input type="password"
             placeholder="Enter your password"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br />
      <button type="submit" className="signupBtn" onClick={registerUser}>Sign up</button>
    </div>
  );
}