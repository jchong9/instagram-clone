import {Link} from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <div className="card mb-5">
      <div className="card-header">
        <Link to={`/profile/${user._id}`}>
          <h5>@{user.username}</h5>
        </Link>
      </div>
      <div className="card-footer">
        <p>{user.bio ? user.bio : "No bio yet"}</p>
      </div>
    </div>
  );
}