import SharePost from "../components/ui/SharePost";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {
  const [allPosts, setAllPosts] = useState(null);

  useEffect(() => {
    setTimeout(getPosts, 2000);
  });

  async function getPosts() {
    const result = await axios.get("http://localhost:5000/get-image");
    console.log(result);
    setAllPosts(result.data.data);
  }

  return (
    <div>
      <h1>Homepage</h1>
      <h2>Welcome</h2>
      <SharePost />
      {allPosts === null ? "": allPosts.map(data => {
        return (
          <div className="user-post">
            <img src={require(`../images/userContent/${data.imageURL}`)}
                 height="100"
                 width="100"
                 alt="not loading"
            />
          </div>
        );
      })}
    </div>
  );
}