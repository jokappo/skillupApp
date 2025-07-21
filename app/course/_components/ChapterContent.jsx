"use client";
import React, { useContext, useEffect, useState } from "react";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import YouTube from "react-youtube";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

function ChapterContent({ data, refreshData }) {
  const { courseId } = useParams();
  const enrolCourse = data?.enroleCourse;
  const courseContent = data?.courses?.courseContent;
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;

  const [completedChapters, setCompletedChapters] = useState([]);


useEffect(() => {
  setCompletedChapters(enrolCourse?.completedChapiters ?? []);
}, [enrolCourse]);

  const isCompleted = completedChapters.includes(selectedChapterIndex);

  /* const markChapterCompleted = async () => {
    try {
      const updatedChapters = [...completedChapters, selectedChapterIndex];

      const response = await axios.put("/api/enroleCourse", {
        courseId,
        completedChapter: updatedChapters,
      });

      if (response?.data?.success) {
        toast.success("Chapter marked as completed successfully!");
        setCompletedChapters(updatedChapters);
        refreshData?.(); // in case refreshData is passed
      }
    } catch (err) {
      toast.error("Failed to mark as completed.");
      console.error(err);
    }
  }; */

  const toggleChapterCompletion = async () => {
    let updatedCompletedChapiters = [...completedChapters];

    if (updatedCompletedChapiters.includes(selectedChapterIndex)) {
      // Chapitre déjà complété → le retirer
      updatedCompletedChapiters = updatedCompletedChapiters.filter(
        (index) => index !== selectedChapterIndex
      );
    } else {
      // Chapitre pas encore complété → l'ajouter
      updatedCompletedChapiters.push(selectedChapterIndex);
    }

    try {
      const response = await axios.put("/api/enroleCourse", {
        courseId,
        completedChapter: updatedCompletedChapiters,
      });

      if (response.data.success) {
        toast.success("Chapter completion updated!");
        setCompletedChapters(updatedCompletedChapiters);
        refreshData();
      } else {
        toast.error("Failed to update chapter status.");
      }
    } catch (error) {
      toast.error("Error while updating chapter completion.");
      console.error(error);
    }
  };

  if (!Array.isArray(videoData) || videoData.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        <AlertCircle className="inline-block mr-2 text-red-500" />
        No videos available.
      </div>
    );
  }

  return (
    <div className="p-10 h-screen w-full overflow-y-scroll scrollbar-hide">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">
          {selectedChapterIndex + 1} -{" "}
          {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
        </h2>
        {/* {!isCompleted ? (
          <Button onClick={markChapterCompleted}>
            <CheckCircle className="mr-2" /> Mark As Completed
          </Button>
        ) : (
          <Button disabled variant="outline">
            <CheckCircle className="mr-2" /> Completed
          </Button>
        )} */}
        <Button
          onClick={() => toggleChapterCompletion()}
          variant={
            completedChapters.includes(selectedChapterIndex)
              ? "outline"
              : "default"
          }
        >
          {completedChapters.includes(selectedChapterIndex) ? (
            <>
              <X className="mr-1" /> Mark Incomplete
            </>
          ) : (
            <>
              <CheckCircle className="mr-1" /> Mark As Completed
            </>
          )}
        </Button>
      </div>

      <h2 className="my-2 mt-3 font-bold text-xl">Related Videos 📽️</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {videoData.map((video, index) => {
          const videoId = video?.videoId || video?.youtubeVideo?.videoId;
          if (!videoId) return null;

          return (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <YouTube
                videoId={videoId}
                opts={{ width: "100%", height: "390" }}
              />
            </div>
          );
        })}
      </div>

      <h2 className="my-2 mt-3 font-bold text-xl">Topics 🗃️</h2>
      <div>
        {topics?.length ? (
          topics.map((topic, index) => (
            <div
              key={index}
              className="my-4 bg-secondary p-10 rounded-lg shadow-md"
            >
              <h2 className="font-bold text-xl text-primary hover:underline hover:underline-offset-2">
                {index + 1}- {topic?.topic || "No topic name available"}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: topic?.content || "No description available",
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No topics available for this chapter.</p>
        )}
      </div>

      <div className="p-10" />
    </div>
  );
}

export default ChapterContent;
