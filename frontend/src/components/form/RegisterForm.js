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
      <input type="text"
             placeholder="Username*"
             className="mb-3"
             maxLength="20"
             minLength="4"
             required
             value={name || ""}
             onChange={(e) => setName(e.target.value)}
      />
      <br/>
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
      <br/>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}