"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import AddNewCourseDialogue from "./AddNewCourseDialogue";
import { Sparkle } from "lucide-react";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  return (
    <>
      <div className=" mt-5">
        <h2 className="font-bold text-3xl my-2">Course List</h2>

        {courseList.length === 0 ? (
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
              <Button> <Sparkle/> Create your first course</Button>
            </AddNewCourseDialogue>
          </div>
        ) : (
          <div> {/* list of courses */}</div>
        )}
      </div>
    </>
  );
}

export default CourseList;
