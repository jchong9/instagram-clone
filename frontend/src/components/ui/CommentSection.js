import {useEffect, useState} from "react";
import axios, {all} from "axios";
import {Link} from "react-router-dom";

export default function CommentSection(props) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getComments();
  }, []);

  async function uploadComment(e) {
    e.preventDefault();

    let result = await axios.post("http://localhost:5000/add-comment", {
      postID: props.imgDetails._id,
      userID: user._id,
      username: user.name,
      content: comment
    }, {
      headers: {"Content-Type": "application/json"}
    });

    setComment("");
    getComments();
  }

  async function getComments() {
    const result = await axios.get("http://localhost:5000/get-comments", {
      params: {id: props.imgDetails._id}
    });
    setAllComments(result.data);
  }

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="center modal-container">
        <div className="modal-header">
          <h1>Comments</h1>
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512"
               onClick={props.onClose}>
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </div>
        <div className="modal-body">
          <div className="comment-section">
            {!allComments || allComments.length === 0 ? (
              <h5>No comments here...</h5>
            ) : allComments.map((data) => {
              return (
                <div key={data._id}>
                  <h6>
                    <Link to="/profile" state={{userID: data.userID}}>
                      @{data.username}:
                    </Link>
                  </h6>
                  <p>
                    {data.content}
                  </p>
                </div>
              );
            })}
          </div>
          <form onSubmit={uploadComment}>
            <input type="text"
                   placeholder="Enter a comment..."
                   className="form-control"
                   value={comment || ""}
                   onChange={(e) => setComment(e.target.value)}
            />
          </form>
        </div>
      </div>
    </>
  );
}