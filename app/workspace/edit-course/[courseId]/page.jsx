"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourseInfo from "../_components/CourseInfo";
import ChapiterTopicList from "../_components/ChapiterTopicList";

function EditCourse({ viewCourse = false }) {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState();

  const GetCourseInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses?courseId=${courseId}`);
      const courseData = response?.data;
      if (response?.data?.success) {
        setCourse(courseData.data);
      }
    } catch (error) {
      console.log("Error fetching course info: ", error);
      toast.error(
        "Failed to fetch course information. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCourseInfo();
  }, []);

  return (
    <section>
      <div>
        <CourseInfo course={course} viewCourse={viewCourse} />
        <ChapiterTopicList course={course} />
      </div>
    </section>
  );
}

export default EditCourse;
