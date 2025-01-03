import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DisplayPost from "../components/ui/DisplayPost";

export default function Profile() {
  const location = useLocation();
  const { userID } = location.state ? location.state : {};
  const [user, setUser] = useState({following: [], followers: []});
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [seed, setSeed] = useState(1);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    getUser();
    if (!user || !userID) {
      navigate("/");
    }
    setSeed(Math.random());
  }, [userID]);

  async function getUser() {
    const result = await axios.get(`${apiURL}/users/${userID}`);
    setUser(result.data);
  }

  async function followUser() {
    const result = await axios.patch(`${apiURL}/add-follow`, {
      follower: loggedUser._id,
      followee: userID
    });
    setUser(result.data.followee);
    localStorage.setItem("user", JSON.stringify(result.data.follower));
  }

  async function unfollowUser() {
    const result = await axios.patch(`${apiURL}/remove-follow`, {
      follower: loggedUser._id,
      followee: userID
    });
    setUser(result.data.followee);
    localStorage.setItem("user", JSON.stringify(result.data.follower));
  }

  return (
    <>
      <div className="container-fluid w-50 text-center">
        <h1>{user.username}</h1>
        <div className="row text-center mb-3">
          <h6 className="col">Following: {user.following.length}</h6>
          <h6 className="col">Followers: {user.followers.length}</h6>
        </div>
        <p className="m-2">{user.bio}</p>
        {loggedUser._id === userID ? (
          <Link to="/edit-profile">
            <button className="btn btn-outline-primary m-3">
              Edit profile
            </button>
          </Link>
        ) : (
          <div>
            {loggedUser.following.includes(userID) ? (
              <button className="btn btn-secondary m-3" onClick={unfollowUser}>
                Unfollow
              </button>
            ) : (
              <button className="btn btn-primary m-3" onClick={followUser}>
                Follow
              </button>
            )}
          </div>
        )}
      </div>
      <DisplayPost requestURL={"/users/" + userID + "/posts"}
                   id={userID}
                   search=""
                   followingList={user.following}
                   key={seed} />
    </>
  );
}