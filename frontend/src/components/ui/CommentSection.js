import {useState} from "react";

export default function CommentSection(props) {
  const [comment, setComment] = useState('');

  function uploadComment() {
    console.warn("uploaded!");
  }

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="modal-container">
        <h1>{props.imgDetails.username}</h1>
        <form onSubmit={uploadComment}>
          <input type="text"
                 placeholder="Enter a comment..."
                 className="form-control"
                 value={comment || ""}
                 onChange={(e) => setComment(e.target.value)}
          />
        </form>
        <button onClick={props.onClose}>Close</button>
      </div>
    </>
  );
}