import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

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
          limit: 1
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
        <Pagination
          totalPages={totalPages}
          currPage={currPage}
          handlePageChange={(page) => handlePageChange(page)} />
      )}
    </div>
  );
}