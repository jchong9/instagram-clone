import {useEffect, useState} from "react";
import axios from "axios";

export default function DisplayPost() {
  const [allPosts, setAllPosts] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("Loading posts... 😅");

  useEffect(() => {
    setTimeout(() => {
      setLoadingMsg("");
      getPosts();
    }, 2000);
  });

  async function getPosts() {
    const result = await axios.get("http://localhost:5000/get-image");
    console.log(result);
    setAllPosts(result.data.data);
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h3>{loadingMsg}</h3>
      {allPosts === null ? "": allPosts.map(data => {
        return (
          <div className="card mb-5">
            <div className="card-header">
              <h5>Test</h5>
            </div>
            <div className="card-body">
              <img src={require(`../../images/userContent/${data.imageURL}`)}
                   className="card-img-top"
                   alt="not loading"
              />
              <p className="card-text">
                Blah blah blah blah blag
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}