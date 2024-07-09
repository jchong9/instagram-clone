import {useState} from "react";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  function searchPost() {
    console.warn("Searching...");
  }

  return (
    <div>
      <h1>Start Exploring the Community</h1>
      <input type="text"
             placeholder="Enter a search query"
             className="exploreSearch"
             value={searchQuery || ""}
             onChange={(e) => {setSearchQuery(e.target.value)}}
      />
      <button type="submit" className="exploreBtn" onClick={searchPost}>Submit</button>
    </div>
  );
}