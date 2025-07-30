import React from "react";
import WelcomeBanner from "../_components/WelcomeBanner";
import EnroleCourseList from "../_components/EnroleCourseList";

const MyLearning = () => {
  return (
    <div>
      <h2 className=" font-bold text-2xl my-5">My Learning</h2>
      <WelcomeBanner />
      <EnroleCourseList />
    </div>
  );
};

export default MyLearning;
