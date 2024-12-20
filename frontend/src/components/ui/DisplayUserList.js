import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

export default function DisplayUserList(props) {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("Loading users... 😅");

  useEffect(() => {
    setTimeout(() => {
      setLoadingMsg("");
      getUsers();
    }, 2000)
  }, []);

  async function getUsers() {
    const result = await axios.get(`http://localhost:5000/search/users/${props.usernameSearch}`, {
      params: {
        username: props.usernameSearch
      }
    });
    setAllUsers(result.data);
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="m-3">{loadingMsg}</h3>
      {!allUsers || allUsers.length === 0 ?
        <div className="m-2">
          <h5>No matching users... 😔</h5>
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
        })}
    </div>
  );
}