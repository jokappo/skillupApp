"use client";
import AppHeader from "@/app/workspace/_components/AppHeader";
import React, { useEffect } from "react";
import ChaptersListSideBar from "../_components/ChaptersListSideBar";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

function Course() {
  const { courseId } = useParams();
  const [data, setData] = React.useState([]);

  const GetEnrollCoursesById = async () => {
    try {
      const response = await axios.get(
        "/api/enroleCourse?courseId=" + courseId
      );

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
    GetEnrollCoursesById();
  }, []);

  return (
    <div className=" h-screen overflow-hidden">
      <AppHeader hideSideBare={true} />
      <div className=" flex gap-10">
        <ChaptersListSideBar data={data} />
        <ChapterContent
          data={data}
          refreshData={() => GetEnrollCoursesById()}
        />
      </div>
    </div>
  );
}

export default Course;
