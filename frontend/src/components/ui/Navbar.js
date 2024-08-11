import { Link, useNavigate } from 'react-router-dom';
import SharePost from "./SharePost";

export default function Navbar() {
  const auth = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate('/signup');
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand abs">
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512 512">
            <path
              d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
          </svg>
          Instaphoto
          </span>
        </Link>
        <button className="navbar-toggler ms-auto" type="button"
                data-bs-toggle="collapse" data-bs-target="#collapseNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse collapse" id="collapseNavbar">
          {!auth ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            </ul>
          ) : (
            <>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/explore-feed" className="nav-link">Explore</Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <SharePost />
                <li className="nav-item">
                  <Link to="/profile"
                        state={{userID: auth._id}}
                        className="nav-link"
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link" onClick={logout}>Log out</Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}