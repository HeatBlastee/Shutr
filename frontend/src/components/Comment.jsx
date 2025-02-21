import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="my-3 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12">
          <AvatarImage src={comment?.author?.profilePicture} alt="Profile" />
          <AvatarFallback className="bg-gray-300 text-gray-700 text-lg font-semibold">
            {comment?.author?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex flex-col">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {comment?.author?.username}
          </h1>
          <p className="text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl mt-1 max-w-md">
            {comment?.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
