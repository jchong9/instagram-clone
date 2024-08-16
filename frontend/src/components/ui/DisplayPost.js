import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import CommentSection from "./CommentSection";

export default function DisplayPost(requestProps) {
  const [allPosts, setAllPosts] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("Loading posts... 😅");
  let userID = JSON.parse(localStorage.getItem("user"))._id;
  const [showComments, setShowComments] = useState(false);
  const [currPost, setCurrPost] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoadingMsg("");
      getPosts();
    }, 3000);
  });

  async function getPosts() {
    const result = await axios.get(`http://localhost:5000/${requestProps.requestURL}`, {
      params: {
        id: requestProps.id,
        search: requestProps.search,
        following: requestProps.following
      }
    });
    setAllPosts(result.data);
  }

  async function likePost(imageID, index) {
    const result = await axios.patch("http://localhost:5000/add-like", {
      userID, imageID
    });
    const updatedPosts = [...allPosts];
    updatedPosts.splice(index, 1, result.data);
    setAllPosts(updatedPosts);
  }

  async function unlikePost(imageID, index) {
    const result = await axios.patch("http://localhost:5000/remove-like", {
      userID, imageID
    });
    const updatedPosts = [...allPosts];
    updatedPosts.splice(index, 1, result.data);
    setAllPosts(updatedPosts);
  }

  function closeComments() {
    setShowComments(false);
  }

  function displayComments(postObj) {
    setCurrPost(postObj);
    setShowComments(true);
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {showComments && (
        <CommentSection onClose={closeComments} imgDetails={currPost} />
      )}
      <h3 className="m-3">{loadingMsg}</h3>
      {!allPosts || allPosts.length === 0 ?
        <div className="m-2">
          <h5>No posts here... 😔</h5>
        </div>
        : allPosts.filter((data) => {
          try {
            return require(`../../images/userContent/${data.imageURL}`);
          }
          catch(err) {
            return null;
          }
        }).map((data, index) => {
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
              <div>
                {data.likedBy.includes(userID) ? (
                  <svg xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                       id="likedHeart"
                       onClick={() => unlikePost(data._id, index)}>
                    <path
                      d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                       onClick={() => likePost(data._id, index)}>
                    <path
                      d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                  </svg>
                )}
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 512 512"
                     onClick={() => displayComments(data)}>
                  <path
                    d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z"/>
                </svg>
              </div>
            </div>
            <div className="card-footer">
              <div className="card-text">
                @{data.username}: {data.caption}
                <br/>
                <small className="date-txt">
                  {data.createdOn}
                </small>
              </div>
              <small onClick={() => displayComments(data)}>
                Show all comments...
              </small>
            </div>
          </div>
        );
        })}
    </div>
  );
}