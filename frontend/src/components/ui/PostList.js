import {useEffect, useState} from "react";
import axios from "axios";
import CommentList from "./CommentList";
import Pagination from "./Pagination";
import {API} from "../../utils/constants";
import Post from "./Post";

export default function PostList({ requestURL, followingList }) {
  const [allPosts, setAllPosts] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("Loading posts... 😅");
  const userID = JSON.parse(localStorage.getItem("user"))._id;
  const [showComments, setShowComments] = useState(false);
  const [currPost, setCurrPost] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiURL = API.baseURL;

  useEffect(() => {
    try {
      getPosts();
    }
    finally {
      if (!allPosts || allPosts.length === 0) {
        setLoadingMsg("No posts here... 😔");
      }
      else {
        setLoadingMsg("");
      }
    }
  }, [currPage]);

  async function getPosts() {
    try {
      if (loading) {
        return;
      }

      setLoading(true);
      const { data } = await axios.get(`${apiURL}${requestURL}`, {
        params: {
          following: followingList,
          page: currPage,
          limit: API.postDisplayLimit,
        }
      });
      setAllPosts(data.posts);
      setTotalPages(data.totalPages);
    }
    catch(err) {
      console.error("Error getting posts: " + err);
    }
    finally {
      setLoading(false);
    }
  }

  async function likePost(imageID, index) {
    if (isDisabled) {
      return;
    }

    const { data } = await axios.patch(`${apiURL}/add-like`, {
      userID, imageID
    });
    const updatedPosts = [...allPosts];
    updatedPosts.splice(index, 1, data);
    setAllPosts(updatedPosts);

    setIsDisabled(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  }

  async function unlikePost(imageID, index) {
    if (isDisabled)
      return;

    const { data } = await axios.patch(`${apiURL}/remove-like`, {
      userID, imageID
    });
    const updatedPosts = [...allPosts];
    updatedPosts.splice(index, 1, data);
    setAllPosts(updatedPosts);

    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  }

  function closeComments() {
    setShowComments(false);
    document.body.style.overflow = "auto";
  }

  function displayComments(postObj) {
    setCurrPost(postObj);
    setShowComments(true);
    document.body.style.overflow = "hidden";
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {showComments && (
        <CommentList onClose={closeComments} imgDetails={currPost} />
      )}
      {!allPosts || allPosts.length === 0 ?
        <div className="center-relative loading-msg">
          <h5>{loadingMsg}</h5>
        </div>
        : allPosts.filter((data) => {
          try {
            return require(`../../images/userContent/${data.imageURL}`);
          }
          catch(err) {
            return null;
          }
        }).map((data, index) => {
        return (
          <Post post={data}
                index={index}
                displayComments={() => displayComments(data)}
                likePost={() => likePost(data._id, index)}
                unlikePost={() => unlikePost(data._id, index)}
                key={data._id} />
        );
      })}
      {allPosts && allPosts.length !== 0 && (
        <Pagination
          totalPages={totalPages}
          currPage={currPage}
          handlePageChange={(page) => setCurrPage(page)} />
      )}
    </div>
  );
}