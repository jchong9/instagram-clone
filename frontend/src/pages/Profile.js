import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import PostList from "../components/ui/PostList";
import {API} from "../utils/constants";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const apiURL = API.baseURL;

async function getUser(id){
  const { data } = await axios.get(`${apiURL}/users/${id}`);
  if (!data) {
    throw new Error("User not found");
  }
  return data;
}

async function addFollow({ followerID, followeeID }) {
  const { data } = await axios.patch(`${apiURL}/add-follow`, {
    follower: followerID,
    followee: followeeID
  });
  return data;
}

async function removeFollow({ followerID, followeeID }) {
  const { data } = await axios.patch(`${apiURL}/remove-follow`, {
    follower: followerID,
    followee: followeeID
  });
  return data;
}


export default function Profile() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [seed, setSeed] = useState(1);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  const followMutation = useMutation({
    mutationFn: addFollow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      localStorage.setItem("user", JSON.stringify(data.follower));
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: removeFollow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      localStorage.setItem("user", JSON.stringify(data.follower));
    },
  });

  const handleFollow = () => {
    followMutation.mutate({ followerID: loggedUser._id, followeeID: id });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate({ followerID: loggedUser._id, followeeID: id });
  };

  useEffect(() => {
    setSeed(Math.random());
  }, [id]);

  if (isLoading) {
    return (
      <div className="center-relative loading-msg">
        <h5>Loading profile... 😅</h5>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="center-relative loading-msg">
        <h5>Profile does not exist 😢</h5>
      </div>
    );
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
        {loggedUser._id === id ? (
          <Link to="/edit-profile">
            <button className="btn btn-outline-primary m-3">
              Edit profile
            </button>
          </Link>
        ) : (
          <div>
            {loggedUser.following.includes(id) ? (
              <button className="btn btn-secondary m-3" onClick={handleUnfollow}>
                Unfollow
              </button>
            ) : (
              <button className="btn btn-primary m-3" onClick={handleFollow}>
                Follow
              </button>
            )}
          </div>
        )}
      </div>
      <PostList requestURL={`/users/${id}/posts`}
                id={id}
                search=""
                followingList={user.following}
                key={seed}/>
    </>
  );
}