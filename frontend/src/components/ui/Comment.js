import {Link} from "react-router-dom";

export default function Comment({ comment }) {
  return (
    <div>
      <h6>
        <Link to={`/profile/${comment.userID}`}>
          @{comment.username}
        </Link>
        &nbsp;• {comment.createdAt}
      </h6>
      <p>
        {comment.content}
      </p>
    </div>
  );
}