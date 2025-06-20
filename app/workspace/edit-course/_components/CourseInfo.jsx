"use client";
import { Clock, Settings } from "lucide-react";
import React from "react";
import AlarmClock from "./AlarmClock";
import { Book } from "lucide-react";
import BookMarked from "./BookMarked";
import ChartGantt from "./ChartGantt";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

function CourseInfo({ course }) {
  const [randomImage, setRandomImage] = useState();
  const [isImageChecked, setIsImageChecked] = useState(false); // Nouvel état pour indiquer si la vérification est terminée.
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const courseLayout = course?.couseJson?.course;

  const generateCourseContent = async () => {
    // call api to generate content
    try {
      setLoading(true);
      const response = await axios.post("/api/generateCourseContent", {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(response.data);
      router.replace('/workspace')
      toast.success("Course content generated successfully!",{
        position: "buttom right",
      });
    } catch (error) {
      console.log("Error generating course content: ", error);
      toast.error("Failed to generate course content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalDuration = courseLayout?.chapters?.reduce((total, chapter) => {
    // Extraction de la durée en heures
    const durationInHours = parseFloat(chapter.duration); // Retire automatiquement "hours" et convertit en nombre
    return total + durationInHours;
  }, 0);

  //random image
  useEffect(() => {
    if (!course?.bannerImageUrl) {
      const getRandomImage = () => {
        const randomId = Math.floor(Math.random() * 9); // Génère un ID entre 0 et 8
        return `https://picsum.photos/id/${randomId}/500/300`;
      };
      setRandomImage(getRandomImage());
    }
    setIsImageChecked(true); // La vérification est terminée.
  }, [course?.bannerImageUrl]);

  return (
    <div className=" md:flex gap-5 justify-between p-5 rounded-xl shadow-md ">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold">{courseLayout?.name}</h2>
        <p className="line-clamp-2 mt-2 text-slate-500">
          {courseLayout?.description}
        </p>
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* duration */}
          <div className=" flex items-center gap-2 p-3 rounded-lg shadow-md bg-slate-50">
            <AlarmClock />
            <section>
              {" "}
              <h2 className=" font-bold text-sm">Duration</h2>
              <h2 className=" text-xs">{totalDuration} hours</h2>
            </section>
          </div>
          {/* chapters */}
          <div className=" flex items-center gap-2 p-3 rounded-lg shadow-md bg-slate-50">
            <BookMarked />
            <section>
              {" "}
              <h2 className=" font-bold text-sm">Chapters</h2>
              <h2 className=" text-xs">{courseLayout?.chapters?.length} Cps</h2>
            </section>
          </div>
          {/* level */}
          <div className=" flex items-center gap-2 p-3 rounded-lg shadow-md bg-slate-50">
            <ChartGantt />
            <section>
              {" "}
              <h2 className=" font-bold text-sm">Difficulty Level</h2>
              <h2 className=" text-xs">{course?.level} </h2>
            </section>
          </div>
        </div>

        <Button className="w-full" onClick={generateCourseContent} disabled={loading}>
          {loading ? (
            <div className="w-full flex justify-center gap-x-2 items-center">
              <div className="w-3 h-3 rounded-full bg-[#d991c2] animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-[#9869b8] animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-[#6756cc] animate-bounce"></div>
            </div>
          ) : (
            <>
              <Settings />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {/* baner image */}
      {isImageChecked && (
        <div className="flex-shrink-0">
          {course?.bannerImageUrl ? (
            <Image
              src={course?.bannerImageUrl}
              alt={`${courseLayout?.name} banner`}
              width={400}
              height={400}
              className=" w-full h-[240px] rounded-lg mt-5 md:mt-0 object-cover aspect-auto"
            />
          ) : (
            <img
              src={randomImage}
              alt="Random Image"
              width={400}
              height={400}
              className=" w-full rounded-lg mt-5 md:mt-0 object-cover aspect-auto"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CourseInfo;
