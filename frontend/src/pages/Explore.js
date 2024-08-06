import {useState} from "react";
import DisplayPost from "../components/ui/DisplayPost";

export default function Explore() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  function searchPost(e) {
    e.preventDefault();
    setFormSubmitted(true);
    setSearchQuery(searchInput);
  }

  //MAKE DISPLAYPOSTS GET RECALLED

  return (
    <div>
      <h1>Start Exploring the Community</h1>
      <form onSubmit={searchPost}>
        <input type="text"
               placeholder="Enter a search query"
               className="exploreSearch"
               value={searchInput || ""}
               onChange={(e) => setSearchInput(e.target.value)}
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
          <DisplayPost requestURL="get-image" id={user._id} search="" />
        </div>
      )}
    </div>
  );
}