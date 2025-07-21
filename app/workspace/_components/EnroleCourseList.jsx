"use client";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import EnrollCourseCart from "./EnrollCourseCart";

function EnroleCourseList() {
  const [data, setData] = useState([]);

  const GetEnrollCourses = async () => {
    try {
      const response = await axios.get("/api/enroleCourse");

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message, {
          position: "bottom-right",
        });
        setData(responseData.data);
        console.log(responseData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    GetEnrollCourses();
  }, []);

  return (
    data?.length > 0 && (
      <div className=" mt-10">
        <h2 className="font-bold text-2xl my-2">
          Continue Learning Your Cours
        </h2>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.map((course, index) => (
            <EnrollCourseCart
              key={index}
              course={course?.courses}
              enrollCourse={course?.enroleCourse}
            />
          ))}
        </div>
      </div>
    )
  );
}

export default EnroleCourseList;
