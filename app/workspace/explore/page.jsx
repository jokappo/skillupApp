"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewCourseDialogue from "../_components/AddNewCourseDialogue";
import { Sparkle } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCart from "../_components/CourseCart";
import { Skeleton } from "@/components/ui/skeleton";

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser();

  const fetchCoursList = async () => {
    try {
      const response = await axios.get("/api/courses?courseId=0");

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
    <div>
      <h2 className=" font-bold text-3xl mb-6"> Explore More Courses</h2>
      <div className="flex items-center gap-5 mb-6 max-w-md">
        <Input placeholder="search" />
        <Button>
          <Search /> Search{" "}
        </Button>
      </div>

      <div className=" mt-5">
        <h2 className="font-bold text-2xl my-2">Course List</h2>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseList.length > 0
            ? courseList?.map((couse, index) => (
                <CourseCart key={index} course={couse} />
              ))
            : [0, 1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
