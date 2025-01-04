import PostList from "../components/ui/PostList";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Home() {
  const [showPersonalFeed, setShowPersonalFeed] = useState(true);
  const [seed, setSeed] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setSeed(Math.random());
  }, [showPersonalFeed]);

  function displayPersonalFeed() {
    setShowPersonalFeed(true);
  }

  function displayRecommendations() {
    setShowPersonalFeed(false);
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
          <div className="text-center">
            <h1>Your Personal Feed</h1>
          </div>
          <PostList requestURL={"/users/" + user._id + "/following/posts"}
                    id={user._id}
                    search=""
                    followingList={user.following}
                    key={seed}/>
        </>
      ) : (
        <>
          {user.following.length === 0 ? (
            <div className="loading-msg center-relative">
              <h5>
                Not following anyone? Try <Link to="/explore-feed">exploring</Link>
              </h5>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1>Recommendations</h1>
                <p className="text-primary">People you follow like these posts</p>
              </div>
              <PostList requestURL={"/users/" + user._id + "/recommendations/posts"}
                        id={user._id}
                        search=""
                        followingList={user.following}
                        key={seed}/>
            </>
          )}
        </>
      )}
    </>
  );
}