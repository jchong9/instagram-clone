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
      <div className="form-group">
        <label>Enter your email: </label>
        <input type="text"
               placeholder="Email*"
               className="form-control"
               required
               value={email || ""}
               onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group my-3">
        <label>Enter your password: </label>
        <input type="password"
               placeholder="Password*"
               className="form-control"
               maxLength="20"
               minLength="3"
               required
               value={password || ""}
               onChange={(e) => setPassword((e.target.value))}
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}