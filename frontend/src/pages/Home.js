import DisplayPost from "../components/ui/DisplayPost";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function Home() {
  const [showPersonalFeed, setShowPersonalFeed] = useState(true);
  const [seed, setSeed] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  function displayPersonalFeed() {
    setShowPersonalFeed(true);
    setSeed(Math.random() * 1000);
  }

  function displayRecommendations() {
    setShowPersonalFeed(false);
    setSeed(Math.random() * 1000);
  }

  return (
    <>
      <div className="center-relative">
        <span className={showPersonalFeed ? "active me-3" : "inactive me-3"}
                    onClick={displayPersonalFeed}>
          Personal Feed
        </span>
        <span className={showPersonalFeed ? "inactive" : "active"}
              onClick={displayRecommendations}>
          Recommended posts
        </span>
      </div>
      {showPersonalFeed ? (
        <>
          {user.following.length === 0 ? (
            <h5 className="center-relative">
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
                           following={user.following}
                           key={seed}/>
            </>
          )}
        </>
      ) : (
        <>
          {user.following.length === 0 ? (
            <h5 className="center-relative">
              Not following anyone? Try <Link to="/explore-feed">exploring</Link>
            </h5>
          ) : (
            <>
              <div className="text-center">
                <h1>Recommendations</h1>
                <p className="text-primary">People you follow like these posts</p>
              </div>
              <DisplayPost requestURL={"/users/" + user._id + "/recommendations/posts"}
                           id={user._id}
                           search=""
                           following={user.following}
                           key={seed}/>
            </>
          )}
        </>
      )}
    </>
  );
}