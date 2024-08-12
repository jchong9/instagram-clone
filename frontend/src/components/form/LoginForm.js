import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
    <form onSubmit={loginUser}>
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
             maxLength="20"
             minLength="3"
             required
             value={password || ""}
             onChange={(e) => setPassword((e.target.value))}
      />
      <br/>
      <button type="submit" className="loginBtn">Submit</button>
    </form>
  );
}