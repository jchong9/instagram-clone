import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registerUser() {
    let result = await fetch("http://localhost:5000/register", {
      method: 'post',
      body: JSON.stringify({name, email, password, bio: "", following: [], followers: []}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    console.warn(result)
    if (result.name) {
      localStorage.setItem("user", JSON.stringify(result));
      navigate('/');
    }
    else {
      alert("Already exists");
    }
  }

  return (
    <form onSubmit={registerUser}>
      <div className="form-group">
        <label>Enter a username: </label>
        <input type="text"
               placeholder="Username*"
               className="form-control"
               maxLength="20"
               minLength="4"
               required
               value={name || ""}
               onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="form-group my-3">
        <label>Enter your email: </label>
        <input type="text"
               placeholder="Email*"
               className="form-control"
               required
               value={email || ""}
               onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="form-group my-3">
        <label>Enter your password: </label>
        <input type="password"
               placeholder="Password*"
               className="form-control"
               required
               value={password || ""}
               onChange={(e) => setPassword((e.target.value))}
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}