import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function DisplayUserList(props) {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("Loading users... 😅");
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      getUsers();
    }
    finally {
      if (!allUsers || allUsers.length === 0) {
        setLoadingMsg("No matching users... 😔");
      }
      else {
        setLoadingMsg("");
      }
    }
  }, [currPage]);

  async function getUsers() {
    try {
      if (loading) {
        return;
      }

      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/search/users/${props.usernameSearch}`, {
        params: {
          username: props.usernameSearch,
          page: currPage,
          limit: 4
        }
      });
      setAllUsers(data.users);
      setTotalPages(data.totalPages);
    }
    catch(err) {
      console.error("Error getting users: " + err);
    }
    finally {
      setLoading(false);
    }
  }

  function handlePageChange(page) {
    setCurrPage(page);
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {!allUsers || allUsers.length === 0 || loading ?
        <div className="center-relative loading-msg">
          <h5>{loadingMsg ? loadingMsg : "Loading users..."}</h5>
        </div>
        : allUsers.map((data) => {
          return (
            <div key={data._id} className="card mb-5">
              <div className="card-header">
                <Link to="/profile" state={{userID: data._id}}>
                  <h5>@{data.username}</h5>
                </Link>
              </div>
              <div className="card-footer">
                <p>{data.bio ? data.bio : "No bio yet"}</p>
              </div>
            </div>
          );
        })
      }
      {allUsers && allUsers.length !== 0 && (
        <div className="page-navigator d-flex justify-content-between mb-4">
          <ul className="pagination">
            <li className={currPage === 1 ? "page-item disabled" : "page-item"}>
              <button className="page-link"
                      onClick={() => handlePageChange(currPage - 1)}
                      disabled={currPage === 1}>
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </button>
            </li>
            {[...Array(totalPages)].map((item, index) => (
              <li className={currPage === index + 1 ? "page-item active" : "page-item"} key={index}>
                <a className="page-link"
                   href="#"
                   onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </a>
              </li>
            ))}
            <li className={currPage === totalPages ? "page-item disabled" : "page-item"}>
              <button className="page-link"
                      onClick={() => handlePageChange(currPage + 1)}
                      disabled={currPage === totalPages}>
                <span className="sr-only">Next</span>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}