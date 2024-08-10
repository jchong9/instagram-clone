export default function CommentSection(props) {
  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="modal-container">
        <h1>{props.imgDetails.username}</h1>
        <button onClick={props.onClose}>Close</button>
      </div>
    </>
  );
}