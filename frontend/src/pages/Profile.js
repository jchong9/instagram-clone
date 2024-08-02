import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state;
  const [user, setUser] = useState("");
  const currUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    let result = await axios.get("http://localhost:5000/get-user", {
      params: {id: userID}
    });
    setUser(result.data);
  }

  return (
    <>
      <div className="container-fluid w-50 text-center">
        <h1>{user.name}</h1>
        {currUser._id === user._id && (
          <Link to="/edit-profile">
            <button className="btn btn-outline-primary">
              Edit profile
            </button>
          </Link>
        )}
        <p>{user.bio}</p>
      </div>
    </>
  );
}