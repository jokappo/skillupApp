import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

function EnrollCourseCart({ course, enrollCourse }) {
  const courseJson = course?.couseJson?.course;

  const calculatePerProgress = () => {
    const completedChapters = enrollCourse?.completedChapiters?.length ?? 0;
    const totalChapters = course?.courseContent?.length ?? 1; // Éviter la division par zéro
    return (completedChapters / totalChapters) * 100;
  };

  /* const calculatePerProgrss = () => {
    return (enrollCourse?.completedChapiters?.length ?? 0 / course?.courseContent?.length) * 100;
  }; */
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

        <div className=" grid gap-2">
          <h2 className=" text-primary flex items-center justify-between text-sm">
            Progress <span>{calculatePerProgress()}%</span>
          </h2>
          <Progress value={calculatePerProgress()} />

          <Link href={`/workspace/view-course/${course?.cid}`}>
            <Button className={"w-full"}>
              {" "}
              <PlayCircle /> Continue Learning
            </Button>
          </Link>
        </div>
        {/* <div className="flex items-center justify-between">
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
        </div> */}
      </div>
    </div>
  );
}

export default EnrollCourseCart;
