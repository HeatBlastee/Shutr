import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = React.useRef();
  const dispatch = useDispatch();
  const {posts} = useSelector(state =>state.post);
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.auth);
  const fileChangeHandler = (e) => {
    console.log(e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://shutr.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback className="bg-gray-300 text-gray-700 text-lg font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
          </Avatar>
          <div>
            <h1>{user?.username}</h1>
            
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
        ></Textarea>
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            className="w-full h-80 object-cover hover:opacity-90 transition"
          />
        )}
        <button
          onClick={() => imageRef.current.click()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Upload Image
        </button>
        {file && (loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </Button>
        ) : (
          <Button onClick={createPostHandler} type="submit" className="w-full">
            Create Post
          </Button>
        )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
