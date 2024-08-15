import {useState} from "react";
import DisplayPost from "../components/ui/DisplayPost";
import DisplayUserList from "../components/ui/DisplayUserList";

export default function Explore() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [seed1, setSeed1] = useState(1);
  const [seed2, setSeed2] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  function searchPost(e) {
    e.preventDefault();
    setFormSubmitted(true);
    setSearchQuery(searchInput);
    setSeed1(Math.random());
    setSeed2(10 * seed1);
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
      </div>
      {formSubmitted && searchQuery ? (
        <div>
          <h6 className="text-center">Results for: {searchQuery}</h6>
          <h2>Related users</h2>
          <DisplayUserList usernameSearch={searchQuery}
                           key={seed1}
          />
          <h2>Related posts</h2>
          <DisplayPost requestURL="get-image-search"
                       id={user._id}
                       search={searchQuery}
                       following={user.following}
                       key={seed2}
          />
        </div>
      ) : (
        <div>
          <DisplayPost requestURL="get-image"
                       id={user._id}
                       search=""
                       following={user.following}
                       key={seed2}
          />
        </div>
      )}
    </>
  );
}