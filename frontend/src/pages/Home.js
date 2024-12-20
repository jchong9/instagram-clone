import DisplayPost from "../components/ui/DisplayPost";
import {Link} from "react-router-dom";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {user.following.length === 0 ? (
        <h5 className="center">
          Not following anyone? Try <Link to="/explore-feed">exploring</Link>
        </h5>
      ) : (
        <>
          <div className="text-center">
            <h1>Your Personal Feed</h1>
          </div>
          <DisplayPost requestURL={"/users/" + user._id + "/following/posts"}
                       id={user._id}
                       search=""
                       following={user.following}/>
          <div className="text-center">
            <h1>Recommendations</h1>
            <p className="text-primary">People you follow like these posts</p>
          </div>
          <DisplayPost requestURL={"/users/" + user._id + "/recommendations/posts"}
                       id={user._id}
                       search=""
                       following={user.following}/>
        </>
      )}
    </>
  );
}