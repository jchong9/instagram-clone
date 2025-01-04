import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {API} from "../../utils/constants";
import Comment from "./Comment";
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll";

export default function CommentList({ imgDetails, onClose }) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [submittedComment, setSubmittedComment] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const hasFetchedComments = useRef(false);
  // const observerRef = useRef(null);
  const apiURL = API.baseURL;

  useEffect(() => {
    if (!hasFetchedComments.current) {
      getComments();
      hasFetchedComments.current = true;
    }
  }, []);

  async function uploadComment(e) {
    e.preventDefault();

    const createdTime = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(new Date());

    const newComment = {
      _id: Date.now(),
      postID: imgDetails._id,
      userID: user._id,
      username: user.username,
      content: comment,
      createdAt: createdTime
    }

    setAllComments((prev) => [newComment, ...prev]);

    try {
      const result = await axios.post(`${apiURL}/comments`, {
        postID: imgDetails._id,
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
      const result = await axios.get(`http://localhost:5000/posts/${imgDetails._id}/comments`, {
        params: {
          cursor: nextCursor,
          limit: API.commentDisplayLimit
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
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }

  const observerRef = useInfiniteScroll(getComments, hasMoreComments, loading);

  // const handleObserver = useCallback((entries) => {
  //   const target = entries[0];
  //   if (target.isIntersecting && hasMoreComments && !loading) {
  //     getComments();
  //   }
  // }, [hasMoreComments, loading]);
  //
  // useEffect(() => {
  //   const observer = new IntersectionObserver(handleObserver, {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 1.0,
  //   });
  //
  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }
  //
  //   return () => {
  //     if (observerRef.current) {
  //       observer.unobserve(observerRef.current);
  //     }
  //   };
  // }, [handleObserver]);

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="center-fixed modal-container">
        <div className="modal-header">
          <h1>Comments</h1>
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512"
               onClick={onClose}>
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </div>
        <div className="modal-body">
          <div className="comment-section">
            {!loading && (!allComments || allComments.length === 0) ? (
              <h5>No comments here...</h5>
            ) : allComments.map((data) => {
              return (
                <Comment comment={data}
                         key={data._id} />
              );
            })}
            <div className="center-relative" ref={observerRef}>
              {loading && <p>Loading...</p>}
            </div>
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