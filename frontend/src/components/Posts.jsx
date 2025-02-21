import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import useGetAllPost from "../hooks/useGetAllPost"; // Correct path

const Posts = () => {
  useGetAllPost(); // Call the custom hook

  const { posts } = useSelector((state) => state.post);
 

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Posts;
