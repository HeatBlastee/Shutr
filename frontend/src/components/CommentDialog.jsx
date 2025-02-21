import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const {selectedPost} = useSelector((state) => state.post);
  const [comment,setComment] = useState("");
  const {posts} = useSelector((state)=>state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
    const changeEventHandler = (e) => {
      setText(e.target.value.replace(/\s/g, " ")); // Ensures spaces are properly registered
    };
    
    const sendMessageHandler = async () => {

      try {
        const res = await axios.post(`https://shutr.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
  
        if (res.data.success) {
          const updatedCommentData = [...comment, res.data.comment];
          setComment(updatedCommentData);
  
          const updatedPostData = posts.map(p =>
            p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
          );
          dispatch(setPosts(updatedPostData));
          toast.success(res.data.message);
          setText("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl w-full p-0 flex rounded-lg overflow-hidden">
        {/* Left Side: Post Image */}
        <div className="w-1/2">
          <img
            src={selectedPost?.image}
            alt="post_img"
            className="w-full h-full object-cover"
          />
        </div>

        
        <div className="w-1/2 flex flex-col justify-between bg-white">
          
          {/* Post Author Section */}
<div className="flex items-center justify-between px-4 py-2">
  <div className="flex gap-3 items-center">
    <Avatar className="w-8 h-8">
      <AvatarImage src={selectedPost?.author.profilePicture} />
      <AvatarFallback className="bg-gray-300">CN</AvatarFallback>
    </Avatar>
    <span className="font-semibold text-sm text-gray-800">
      {selectedPost?.author.username}
    </span>
  </div>

  {/* More Options */}
  <Dialog>
    <DialogTrigger asChild>
      <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-black transition" />
    </DialogTrigger>
    <DialogContent className="p-3 bg-white shadow-lg border rounded-md text-sm space-y-2">
      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
        Unfollow
      </div>
      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
        Add to favorites
      </div>
      <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md text-red-500">
        Report
      </div>
    </DialogContent>
  </Dialog>
</div>

{/* Comments Section */}
<div className="px-2 py-1 flex-1 overflow-y-auto max-h-[350px] bg-gray-50 rounded-md shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
  {comment.length > 0 ? (
    comment.map((comment) => <Comment key={comment._id} comment={comment} />)
  ) : (
    <p className="text-gray-500 text-center py-2">No comments yet. Be the first to comment!</p>
  )}
</div>


          {/* Comment Input */}
          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={changeEventHandler}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button onClick={sendMessageHandler} className="text-blue-500 font-semibold ml-2 hover:underline">
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CommentDialog;
