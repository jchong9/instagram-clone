import {useState} from "react";
import DisplayPost from "../components/ui/DisplayPost";

export default function Explore() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [seed, setSeed] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  function searchPost(e) {
    e.preventDefault();
    setFormSubmitted(true);
    setSearchQuery(searchInput);
    setSeed(Math.random());
  }

  return (
    <>
      <div className="m-auto text-center w-50">
        <h1>Start Exploring the Community</h1>
        <form onSubmit={searchPost}>
          <input type="text"
                 placeholder="Enter a search..."
                 className="form-control my-3"
                 value={searchInput || ""}
                 onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>
      {formSubmitted && searchQuery ? (
        <div>
          <h6 className="text-center">Results for: {searchQuery}</h6>
          <DisplayPost requestURL="get-image-search" id={user._id} search={searchQuery} key={seed}/>
        </div>
      ) : (
        <div>
          <DisplayPost requestURL="get-image" id={user._id} search="" key={seed} />
        </div>
      )}
    </>
  );
}