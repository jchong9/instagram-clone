import {useState} from "react";
import axios from "axios";
import {API} from "../../utils/constants";
import Comment from "./Comment";
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";

const apiURL = API.baseURL;

async function getComments(postID, cursor) {
  const { data } = await axios.get(`http://localhost:5000/posts/${postID}/comments`, {
    params: {
      cursor,
      limit: API.commentDisplayLimit
    },
  });
  return data;
}

async function uploadComment(comment) {
  const { data } = await axios.post(`${apiURL}/comments`, comment, {
    headers: {"Content-Type": "application/json"}
  });
  return data;
}

export default function CommentList({ imgDetails, onClose }) {
  const [comment, setComment] = useState('');
  const user = JSON.parse(localStorage.getItem("user"));

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ["comments", imgDetails._id],
    queryFn: ({ pageParam }) => getComments(imgDetails._id, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const commentMutation = useMutation({
    mutationFn: uploadComment,
    onMutate: async (newCommentData) => {
      await queryClient.cancelQueries(["comments", imgDetails._id]);
      const previousData = queryClient.getQueryData(["comments", imgDetails._id]);
      queryClient.setQueryData(["comments", imgDetails._id], (oldData) => {
        const newComment = {
          _id: Date.now(),
          ...newCommentData,
        };

        const updatedPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              comments: [newComment, ...page.comments],
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["comments", imgDetails._id], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", imgDetails._id]);
    },
  });

  function handleSubmitComment(e) {
    e.preventDefault();

    const createdAt = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(new Date());
    const submittedComment = {
      postID: imgDetails._id,
      userID: user._id,
      username: user.username,
      content: comment,
      createdAt,
    }

    commentMutation.mutate(submittedComment);
    setComment("");
  }

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isLoading);

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="center-fixed modal-container">
        <div className="modal-header">
          <h1>Comments</h1>
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 384 512"
               onClick={onClose}>
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </div>
        <div className="modal-body">
          <div className="comment-section">
            {isLoading && !isFetching && <p>Loading comments... 😅</p>}
            {isError && <p>Error fetching comments 😢</p>}
            {!isLoading && !isError && data.pages.map((page, index) =>
              page.comments.length === 0 ? (
                <p key={index}>No comments here 😢</p>
              ) : (
                page.comments.map((comment) => (
                  <Comment comment={comment} key={comment._id} />
                ))
              )
            )}
            <div className="center-relative" ref={observerRef}>
              {isFetching && <p>Loading comments... 😅</p>}
            </div>
          </div>
          <form onSubmit={handleSubmitComment}>
            <input type="text"
                   placeholder="Enter a comment..."
                   className="form-control"
                   value={comment || ""}
                   onChange={(e) => setComment(e.target.value)}/>
          </form>
        </div>
      </div>
    </>
  );
}