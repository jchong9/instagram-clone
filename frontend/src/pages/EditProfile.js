import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();


  function updateUser() {
    navigate("/profile", {state: {userID: user._id}});
  }

  return (
    <div>
      <h1>Edit your profile</h1>
      <form onSubmit={updateUser}>
        <label>New username: </label>
        <br />
        <input type="text"
               value={username || user.name}
               placeholder="Username*"
               maxLength="20"
               minLength="4"
               required
               onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Edit your description: </label>
        <br />
        <textarea placeholder="Enter a caption (optional)"
                  rows="5"
                  cols="30"
                  value={bio || user.bio}
                  onChange={(e) => setBio(e.target.value)}
        >
          {user.bio}
        </textarea>
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
