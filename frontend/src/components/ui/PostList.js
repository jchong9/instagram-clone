import {useState} from "react";
import axios from "axios";
import CommentList from "./CommentList";
import Pagination from "./Pagination";
import {API} from "../../utils/constants";
import Post from "./Post";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const apiURL = API.baseURL;

async function getPosts(requestURL, followingList, page) {
  const { data } = await axios.get(`${apiURL}${requestURL}`, {
    params: {
      following: followingList,
      page: page,
      limit: API.postDisplayLimit,
    }
  });
  return data;
}

async function likePost({ userID, imageID }) {
  const { data } = await axios.patch(`${apiURL}/add-like`, {
    userID,
    imageID,
  });
  return data;
}

async function unlikePost({ userID, imageID }) {
  const { data } = await axios.patch(`${apiURL}/remove-like`, {
    userID,
    imageID,
  });
  return data;
}

export default function PostList({ requestURL, followingList }) {
  const userID = JSON.parse(localStorage.getItem("user"))._id;
  const [showComments, setShowComments] = useState(false);
  const [currPost, setCurrPost] = useState({});
  const [currPage, setCurrPage] = useState(1);

  const queryClient = useQueryClient();

  const { data: postData, isLoading, isError } = useQuery({
    queryKey: ["posts", currPage],
    queryFn: () => getPosts(requestURL, followingList, currPage),
  });

  const likeMutation = useMutation({
    mutationFn: likePost,
    onMutate: async ({ userID, index}) => {
      await queryClient.cancelQueries(["posts", currPage]);
      const previousData = queryClient.getQueryData(["posts", currPage]);
      queryClient.setQueryData(["posts", currPage], (oldData) => {
        const updatedPosts = [...oldData.posts];
        updatedPosts[index].likedBy.push(userID);
        return { ...oldData, posts: updatedPosts };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts", currPage], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts", currPage]);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onMutate: async ({ userID, index }) => {
      await queryClient.cancelQueries(["posts", currPage]);
      const previousData = queryClient.getQueryData(["posts", currPage]);
      queryClient.setQueryData(["posts", currPage], (oldData) => {
        const updatedPosts = [...oldData.posts];
        updatedPosts[index].likedBy = updatedPosts[index].likedBy.filter((id) => {
          return id !== userID;
        });
        return { ...oldData, posts: updatedPosts };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["posts", currPage], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts", currPage]);
    },
  });

  function handleLike(imageID, index) {
    likeMutation.mutate({ userID, imageID, index });
  }

  function handleUnlike(imageID, index) {
    unlikeMutation.mutate({ userID, imageID, index });
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

  if (isLoading) {
    return (
      <div className="center-relative loading-msg">
        <h5>Loading posts... 😅</h5>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="center-relative loading-msg">
        <h5>Could not find posts 😢</h5>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {showComments && (
        <CommentList onClose={closeComments} imgDetails={currPost} />
      )}
      {!postData.posts || postData.posts.length === 0 ? (
        <div className="center-relative loading-msg">
          <h5>No posts here... 😢</h5>
        </div>
      ) : (
        <>
          {postData.posts.filter((post) => {
            try {
              return require(`../../images/userContent/${post.imageURL}`);
            }
            catch (err) {
              return null;
            }
          }).map((post, index) => {
            return (
              <Post post={post}
                  index={index}
                  displayComments={() => displayComments(post)}
                  likePost={() => handleLike(post._id, index)}
                  unlikePost={() => handleUnlike(post._id, index)}
                  key={post._id} />
            );
          })}
          <Pagination
            totalPages={postData.totalPages}
            currPage={currPage}
            handlePageChange={(page) => setCurrPage(page)} />
        </>
      )}
    </div>
  );
}