import { UserProfile } from "@clerk/nextjs";
import React from "react";

const Profile = () => {
  return (
    <div className=" shadow-xl p-5 rounded-lg bg-slate-50 w-fit">
      <h2 className=" font-bold text-2xl mb-7">Manage Your Profile</h2>
      <UserProfile />
    </div>
  );
};

export default Profile;
