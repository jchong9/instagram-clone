import {useState} from "react";
import DisplayPost from "../components/ui/DisplayPost";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  function searchPost(e) {
    e.preventDefault();
    setFormSubmitted(true);
  }

  return (
    <div>
      <h1>Start Exploring the Community</h1>
      <form onSubmit={searchPost}>
        <input type="text"
               placeholder="Enter a search query"
               className="exploreSearch"
               value={searchQuery || ""}
               onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      {formSubmitted && searchQuery ? (
        <div>
          <h2>Results for: {searchQuery}</h2>
          <DisplayPost requestURL="get-image-search" id={user._id} search={searchQuery} />
        </div>
      ) : (
        <div>
          <h2>Start by giving a search</h2>
        </div>
      )}
    </div>
  );
}