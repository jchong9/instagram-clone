import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function DisplayPost() {
  const [allPosts, setAllPosts] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("Loading posts... 😅");

  useEffect(() => {
    setTimeout(() => {
      setLoadingMsg("");
      getPosts();
    }, 3000);
  });

  async function getPosts() {
    const result = await axios.get("http://localhost:5000/get-image");
    if (result.data.length !== 0) {
      setAllPosts(result.data);
    }
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h3>{loadingMsg}</h3>
      {!allPosts ?
        <div>
          <h3>No posts here... 😔</h3>
        </div>
        : allPosts.filter((data) => {
          return true;
        }).map(data => {
        return (
          <div key={data._id} className="card mb-5">
            <div className="card-header">
              <Link to="/profile" state={{userID: data.userID}}>
                <h5>@{data.username}</h5>
              </Link>
            </div>
            <div className="card-body">
              <img src={require(`../../images/userContent/${data.imageURL}`)}
                   className="card-img-top"
                   alt="not loading"
              />
              <p className="card-text">
                {data.caption}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}