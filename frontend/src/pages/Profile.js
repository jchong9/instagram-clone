import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DisplayPost from "../components/ui/DisplayPost";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state;
  const [user, setUser] = useState({following: [], followers: []});
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getUser();
  }, [userID]);

  async function getUser() {
    let result = await axios.get("http://localhost:5000/get-user", {
      params: {id: userID}
    });
    setUser(result.data);
  }

  async function followUser() {
    let result = await axios.patch("http://localhost:5000/update-follow", {
      follower: loggedUser._id,
      followee: userID
    });
    setUser(result.data);
  }

  async function unfollowUser() {
    console.warn("unfollowing!");
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
      <DisplayPost requestURL="get-image-user" id={user._id} search="" />
    </>
  );
}