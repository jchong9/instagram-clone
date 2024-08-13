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
    <div className="center container-fluid w-50">
      <form onSubmit={updateUser}>
        <h1>Edit your profile</h1>
        <div className="form-group">
          <label>New username: </label>
          <input type="text"
                 placeholder={user.name}
                 className="form-control"
                 maxLength="20"
                 minLength="4"
                 value={username || ''}
                 onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group my-3">
          <label>Edit your description: </label>
          <textarea placeholder="Enter a description (optional)"
                    className="form-control"
                    rows="5"
                    value={bio || ''}
                    onChange={(e) => setBio(e.target.value)}>
            {user.bio}
          </textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
