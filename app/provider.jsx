
"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
 // Assuming you have a context for user details

function Provider({ children }) {
  const { user } = useUser(); //get user information from clerk
  const [userDetail, setUserDatail] = useState()

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

   // Function to create a new user in your database
  const CreateNewUser = async () => {
    const result = await axios.post("/api/user", {
      email: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName,
    });
    setUserDatail(result.data.user);
    console.log("User creation result:", result.data);
  };

  console.log("User detail:", userDetail);

  return (
    <div>
      <UserDetailContext.Provider value={{userDetail, setUserDatail}}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
