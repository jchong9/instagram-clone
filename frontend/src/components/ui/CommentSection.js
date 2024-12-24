import {useEffect, useRef, useState} from "react";
import axios, {create} from "axios";
import {Link} from "react-router-dom";

export default function CommentSection(props) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [submittedComment, setSubmittedComment] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const hasFetchedComments = useRef(false);

  useEffect(() => {
    if (!hasFetchedComments.current) {
      getComments();
      hasFetchedComments.current = true;
    }
  }, []);

  async function uploadComment(e) {
    e.preventDefault();

    const createdTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date());
    const newComment = {
      _id: Date.now(),
      postID: props.imgDetails._id,
      userID: user._id,
      username: user.username,
      content: comment,
      createdAt: createdTime
    }

    setAllComments((prev) => [newComment, ...prev]);

    // await axios.post("http://localhost:5000/comments", {
    //   postID: props.imgDetails._id,
    //   userID: user._id,
    //   username: user.username,
    //   content: comment,
    //   createdAt: createdTime
    // }, {
    //   headers: {"Content-Type": "application/json"}
    // });

    try {
      const result = await axios.post("http://localhost:5000/comments", {
        postID: props.imgDetails._id,
        userID: user._id,
        username: user.username,
        content: comment,
        createdAt: createdTime
      }, {
        headers: {"Content-Type": "application/json"}
      });
      setAllComments((prev) =>
        prev.map((comment) =>
          comment._id === newComment._id ? { ...comment, _id: result.data._id } : comment
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      setAllComments((prev) => prev.filter((comment) => comment._id !== newComment._id));
      alert('Failed to add comment. Please try again.');
    }
    setComment("");
    setSubmittedComment(true);
    setTimeout(() => {
      setSubmittedComment(false);
    }, 3000);
  }

  async function getComments() {
    if (loading || !hasMoreComments) {
      return;
    }

    setLoading(true);
    try {
      const result = await axios.get(`http://localhost:5000/posts/${props.imgDetails._id}/comments`, {
        params: {
          cursor: nextCursor,
          limit: 6
        },
      });
      setAllComments((prev) => [...prev, ...result.data.comments]);
      setNextCursor(result.data.nextCursor);
      setHasMoreComments(Boolean(result.data.nextCursor));
    }
    catch(err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="center-fixed modal-container">
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
                      @{data.username}
                    </Link>
                    &nbsp;• {data.createdAt}
                  </h6>
                  <p>
                    {data.content}
                  </p>
                </div>
              );
            })}
            {loading && <p>Loading...</p>}
            {!loading && hasMoreComments && (
              <button onClick={getComments}>Load More</button>
            )}
            {!hasMoreComments && <p>No more comments.</p>}
          </div>
          <form onSubmit={uploadComment}>
            <input type="text"
                   placeholder="Enter a comment..."
                   className="form-control"
                   value={comment || ""}
                   onChange={(e) => setComment(e.target.value)}
                   disabled={submittedComment}
            />
          </form>
        </div>
      </div>
    </>
  );
}