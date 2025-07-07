"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewCourseDialogue from "./AddNewCourseDialogue";
import { Sparkle } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCart from "./CourseCart";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  const fetchCoursList = async () => {
    try {
      const response = await axios.get("/api/courses");

      const { data: responseData } = response;
      if (responseData.success) {
        console.log("All courses :", response.data.data);
        setCourseList(responseData?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    user && fetchCoursList();
  }, [user]);

  return (
    <>
      <div className=" mt-5">
        <h2 className="font-bold text-2xl my-2">Course List</h2>

        {courseList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-secondary p-4 border border-dashed rounded-xl">
            {/* no course avalable */}
            <Image
              className=""
              src={"/noCourses.png"}
              alt="no courses"
              width={300}
              height={300}
            />
            <h2 className="text-xl mb-4 font-semibold">
              Look like you haven't created any courses yet
            </h2>
            <AddNewCourseDialogue>
              <Button>
                {" "}
                <Sparkle /> Create your first course
              </Button>
            </AddNewCourseDialogue>
          </div>
        ) : (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courseList.map((couse, index) => (
              <CourseCart key={index} course={couse} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CourseList;
