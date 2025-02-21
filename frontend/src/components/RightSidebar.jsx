import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const { user, suggestedUsers = [] } = useSelector((store) => store.auth);

  return (
    <div className="w-[320px] fixed top-20 right-10 space-y-6 hidden md:block">
      {/* User Profile Section */}
      {user && (
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="w-14 h-14">
              <AvatarImage src={user.profilePicture} alt="profile picture" />
              <AvatarFallback className="bg-gray-300 text-gray-700">
                {user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user._id}`} className="hover:underline">
                {user.username}
              </Link>
            </h1>
            <span className="text-gray-500 text-xs">{user.bio || "Bio here..."}</span>
          </div>

          <Link to="/login" className="text-blue-500 text-xs font-semibold ml-auto hover:underline">
            Switch
          </Link>
        </div>
      )}

      {/* Suggested Users Section */}
      {suggestedUsers.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-gray-500 text-sm font-semibold">Suggested for You</h2>
            <button className="text-gray-700 text-xs font-semibold hover:underline">See All</button>
          </div>

          <div className="space-y-3">
            {suggestedUsers.map((sUser) => (
              <div key={sUser._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${sUser._id}`}>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={sUser.profilePicture} alt="Suggested User" />
                      <AvatarFallback className="bg-gray-300 text-gray-700">
                        {sUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <h1 className="text-sm font-semibold">{sUser.username}</h1>
                    <span className="text-gray-500 text-xs">Suggested for you</span>
                  </div>
                </div>
                <button className="text-blue-500 text-xs font-semibold hover:underline">Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
