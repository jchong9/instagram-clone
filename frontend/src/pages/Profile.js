import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DisplayPost from "../components/ui/DisplayPost";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state;
  const [user, setUser] = useState({following: [], followers: []});
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    getUser();
    setSeed(Math.random());
  }, [userID]);

  async function getUser() {
    const result = await axios.get("http://localhost:5000/get-user", {
      params: {id: userID}
    });
    setUser(result.data);
  }

  async function followUser() {
    const result = await axios.patch("http://localhost:5000/add-follow", {
      follower: loggedUser._id,
      followee: userID
    });
    setUser(result.data.followee);
    localStorage.setItem("user", JSON.stringify(result.data.follower));
  }

  async function unfollowUser() {
    const result = await axios.patch("http://localhost:5000/remove-follow", {
      follower: loggedUser._id,
      followee: userID
    });
    setUser(result.data.followee);
    localStorage.setItem("user", JSON.stringify(result.data.follower));
  }

  return (
    <>
      <div className="container-fluid w-50 text-center">
        <h1>{user.name}</h1>
        <div className="row text-center mb-3">
          <h6 className="col">Following: {user.following.length}</h6>
          <h6 className="col">Followers: {user.followers.length}</h6>
        </div>
        {loggedUser._id === userID ? (
          <Link to="/edit-profile">
            <button className="btn btn-outline-primary m-2">
              Edit profile
            </button>
          </Link>
        ) : (
          <div>
            {loggedUser.following.includes(userID) ? (
              <button className="btn btn-secondary" onClick={unfollowUser}>
                Unfollow
              </button>
            ) : (
              <button className="btn btn-primary" onClick={followUser}>
                Follow
              </button>
            )}
          </div>
        )}
        <p className="m-2">{user.bio}</p>
      </div>
      <DisplayPost requestURL="get-image-user" id={user._id} search="" key={seed} />
    </>
  );
}