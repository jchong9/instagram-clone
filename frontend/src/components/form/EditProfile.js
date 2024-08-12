import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  async function updateUser() {
    const result = await axios.patch("http://localhost:5000/update-user", {
      name: username ? username : user.name,
      bio: bio ? bio : user.bio
    }, {
      params: {id: user._id}
    });
    localStorage.setItem("user", JSON.stringify(result.data));
    navigate("/profile", {state: {userID: user._id}});
  }

  return (
    <div className="container-fluid text-center m-auto">
      <form onSubmit={updateUser}>
        <h1>Edit your profile</h1>
        <label>New username: </label>
        <br/>
        <input type="text"
               value={username || ''}
               placeholder={user.name}
               maxLength="20"
               minLength="4"
               onChange={(e) => setUsername(e.target.value)}
        />
        <br/>
        <label>Edit your description: </label>
        <br/>
        <textarea placeholder={user.bio ? user.bio : "Enter a description (optional)"}
                  rows="5"
                  cols="30"
                  value={bio || ''}
                  onChange={(e) => setBio(e.target.value)}
        >
        {user.bio}
      </textarea>
        <br/>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
