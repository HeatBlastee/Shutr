import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get("https://shutr.onrender.com/api/v1/post/all", { withCredentials: true });
                if (res.data.success) {
                    const sortedPosts = res.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    dispatch(setPosts(sortedPosts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPost();
    }, [dispatch]);  

};

export default useGetAllPost;
