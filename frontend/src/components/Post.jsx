import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://shutr.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        setComment(updatedComments);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const res = await axios.get(
        `https://shutr.onrender.com/api/v1/post/${post._id}/${liked ? "dislike" : "like"}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setPostLike(liked ? postLike - 1 : postLike + 1);
        setLiked(!liked);

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, likes: liked ? p.likes.filter((l) => l !== user._id) : [...p.likes, user._id] }
            : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback className="bg-gray-300 text-gray-700">
              {post.author?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{post.author?.username}</h1>
            {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-black transition" />
          </DialogTrigger>
          <DialogContent className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button className="w-full text-red-500 hover:bg-red-100">Unfollow</Button>
              <Button className="w-full text-blue-500 hover:bg-blue-100">Add to favorites</Button>
              {user && user?._id === post.author?._id && (
                <Button className="w-full text-gray-500 hover:bg-gray-100">Delete</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="w-full">
        <img src={post.image} alt="Post" className="w-full h-auto max-h-[500px] object-cover" />
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex space-x-4">
          <button onClick={likeOrDislikeHandler}>
            {liked ? (
              <FaHeart className="w-6 h-6 text-red-500 transition-transform transform scale-110" />
            ) : (
              <FaRegHeart className="w-6 h-6 text-gray-600 hover:scale-110 transition" />
            )}
          </button>
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="w-6 h-6 text-gray-600 cursor-pointer hover:scale-110 transition"
          />
          <Send className="w-6 h-6 text-gray-600 cursor-pointer hover:scale-110 transition" />
        </div>
        <Bookmark className="w-6 h-6 text-gray-600 cursor-pointer hover:scale-110 transition" />
      </div>

      {/* Post Details */}
      <div className="px-4 pb-2">
        <span className="font-semibold">{postLike} likes</span>
        <p className="text-gray-700">
          <span className="font-semibold">{post.author.username}</span> {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="text-gray-500 text-sm cursor-pointer hover:underline"
          >
            View all {comment.length} comments
          </span>
        )}
      </div>

      {/* Comments Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Comment Input */}
      <div className="flex items-center px-4 py-2 border-t">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value.replace(/\s/g, " "))}
          className="w-full text-sm p-2 border-none focus:outline-none"
        />
        {text && (
          <span onClick={commentHandler} className="text-blue-500 font-semibold cursor-pointer hover:underline">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
