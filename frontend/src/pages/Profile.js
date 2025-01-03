import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DisplayPost from "../components/ui/DisplayPost";

export default function Profile() {
  const [user, setUser] = useState(null);
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [seed, setSeed] = useState(1);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  async function getUser() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiURL}/users/${id}`);
      if (!data) {
        navigate("/");
      }
      setUser(data);
    }
    catch(err) {
      navigate("/");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "auto";
    getUser();
    setSeed(Math.random());
  }, [id]);

  async function followUser() {
    const { data } = await axios.patch(`${apiURL}/add-follow`, {
      follower: loggedUser._id,
      followee: id
    });
    setUser(data.followee);
    localStorage.setItem("user", JSON.stringify(data.follower));
  }

  async function unfollowUser() {
    const { data } = await axios.patch(`${apiURL}/remove-follow`, {
      follower: loggedUser._id,
      followee: id
    });
    setUser(data.followee);
    localStorage.setItem("user", JSON.stringify(data.follower));
  }

  return (
    <>
      {!loading ? (
        <>
          <div className="container-fluid w-50 text-center">
            <h1>{user.username}</h1>
            <div className="row text-center mb-3">
              <h6 className="col">Following: {user.following.length}</h6>
              <h6 className="col">Followers: {user.followers.length}</h6>
            </div>
            <p className="m-2">{user.bio}</p>
            {loggedUser._id === id ? (
              <Link to="/edit-profile">
                <button className="btn btn-outline-primary m-3">
                  Edit profile
                </button>
              </Link>
            ) : (
              <div>
                {loggedUser.following.includes(id) ? (
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
          <DisplayPost requestURL={`/users/${id}/posts`}
                       id={id}
                       search=""
                       followingList={user.following}
                       key={seed}/>
        </>
      ) : (
        <div className="center-relative">
          <h5 className="loading-msg">Loading profile...</h5>
        </div>
      )}
    </>
  );
}