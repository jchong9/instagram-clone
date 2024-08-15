import {useState} from "react";
import DisplayPost from "../components/ui/DisplayPost";
import DisplayUserList from "../components/ui/DisplayUserList";

export default function Explore() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [seed1, setSeed1] = useState(1);
  const [seed2, setSeed2] = useState(1);
  const [showUsers, setShowUsers] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  function searchPost(e) {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSeed1(Math.random());
    setSeed2(seed1 + 1);
  }

  return (
    <>
      <div className="container-fluid m-auto text-center w-50">
        <h1>Start Exploring the Community</h1>
        <form onSubmit={searchPost}>
          <input type="text"
                 placeholder="Enter a search..."
                 className="form-control my-3"
                 value={searchInput || ""}
                 onChange={(e) => setSearchInput(e.target.value)}/>
        </form>
        <span className={showUsers ? "active me-3" : "inactive me-3"}
              onClick={() => setShowUsers(true)
              }>
          Related users
        </span>
        <span className={showUsers ? "inactive" : "active"}
              onClick={() => setShowUsers(false)}
        >
          Related posts
        </span>
      </div>
      <div>
        <div className="text-center my-2">
          <h6>{searchQuery ? `Results for ${searchQuery}` : "Showing all content"}</h6>
        </div>
        {showUsers ? (
          <DisplayUserList usernameSearch={searchQuery}
                           key={seed1}
          />
        ) : (
          <DisplayPost requestURL="get-image-search"
                       id={user._id}
                       search={searchQuery}
                       following={user.following}
                       key={seed2}
          />
        )}
      </div>
    </>
  );
}