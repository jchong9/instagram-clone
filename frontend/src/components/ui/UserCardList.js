import {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "./Pagination";
import {API} from "../../utils/constants";
import UserCard from "./UserCard";

export default function UserCardList({ searchQuery }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("Loading users... 😅");
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiURL = API.baseURL;

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
      const { data } = await axios.get(`${apiURL}/search/users/${searchQuery}`, {
        params: {
          username: searchQuery,
          page: currPage,
          limit: API.userDisplayLimit,
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

  return (
    <div className="d-flex flex-column align-items-center">
      {!allUsers || allUsers.length === 0 || loading ?
        <div className="center-relative loading-msg">
          <h5>{loadingMsg ? loadingMsg : "Loading users..."}</h5>
        </div>
        : allUsers.map((data) => {
          return (
            <UserCard user={data}
                      key={data._id} />
          );
        })
      }
      {allUsers && allUsers.length !== 0 && (
        <Pagination
          totalPages={totalPages}
          currPage={currPage}
          handlePageChange={(page) => setCurrPage(page)} />
      )}
    </div>
  );
}