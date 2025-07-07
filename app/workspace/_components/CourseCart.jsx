import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Book,
  LoaderCircle,
  PlayCircle,
  Settings,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CourseCart({ course }) {
  const courseJson = course?.couseJson?.course;
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const onEnroleCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/enroleCourse", {
        courseId: course?.cid,
      });

      const { data: responseData } = response;
      console.log(responseData);

      if (responseData.success) {
        toast.success(responseData.message, {
          position: "bottom-right",
        });
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
      <Image
        src={course?.bannerImageUrl || "/placeholder.jpg"}
        alt={course?.name}
        width={400}
        height={300}
        className="w-full h-[250px] object-cover"
      />
      <div className="p-4 flex flex-col gap-4">
        <h2 className="line-clamp-1 font-semibold text-lg">
          {courseJson?.name || "Untitled Course"}
        </h2>
        <p className="line-clamp-2 text-gray-500 text-sm">
          {courseJson?.description || "No description available."}
        </p>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-sm gap-2">
            <Book className="text-primary h-5 w-5" />{" "}
            {courseJson?.noOfChapters || 0} Chapters
          </h2>
          {isEnrolled ? (
            <Button disabled className="transition-transform hover:scale-105">
              <CheckCircle className="text-green-500" /> Already Enrolled
            </Button>
          ) : course?.courseContent?.length ? (
            <Button
              onClick={onEnroleCourse}
              className="transition-transform hover:scale-105"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <PlayCircle />
              )}
              Enroll Course
            </Button>
          ) : (
            <Link href={`/workspace/edit-course/${course?.cid}`}>
              <Button
                className="transition-transform hover:scale-105"
                variant="outline"
              >
                <Settings /> Generate Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCart;
