import {useState} from "react";
import axios from "axios";
import Pagination from "./Pagination";
import {API} from "../../utils/constants";
import UserCard from "./UserCard";
import {useQuery} from "@tanstack/react-query";

const apiURL = API.baseURL;

async function getUsers(search, page) {
  const { data } = await axios.get(`${apiURL}/search/users/${search}`, {
    params: {
      username: search,
      page: page,
      limit: API.userDisplayLimit,
    }
  });
  return data;
}

export default function UserCardList({ searchQuery }) {
  const [currPage, setCurrPage] = useState(1);

  const { data: userCards, isLoading, isError } = useQuery({
    queryKey: ["userCards", currPage],
    queryFn: () => getUsers(searchQuery, currPage),
  });

  if (isLoading) {
    return (
      <div className="center-relative loading-msg">
        <h5>Loading users... 😅</h5>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="center-relative loading-msg">
        <h5>Could not find users 😢</h5>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {!userCards.users || userCards.users.length === 0 ? (
        <div className="center-relative loading-msg">
          <h5>No results for {searchQuery} 😢</h5>
        </div>
      ) : (
        <>
          {userCards.users.map((user) => {
            return (
              <UserCard user={user}
                        key={user._id} />
            );
          })}
          <Pagination
            totalPages={userCards.totalPages ? userCards.totalPages : 0}
            currPage={currPage}
            handlePageChange={(page) => setCurrPage(page)} />
        </>
      )}
    </div>
  );
}