"use client";
import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

function ChaptersListSideBar({ data }) {
  const courseContent = data?.courses?.courseContent;
  const enroleCourse = data?.enroleCourse;
  const { setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const completedChapters = enroleCourse?.completedChapiters ?? [];

  return (
    <div className="w-[350px] bg-secondary h-screen pl-5 overflow-hidden overflow-y-scroll scrollbar-custom">
      <div className="flex justify-between items-center sticky top-0 bg-secondary w-full p-3">
        <h2 className="font-bold my-2 text-xl">Chapters</h2>
        <p className="text-primary">({courseContent?.length})</p>
      </div>

      <Accordion type="single" collapsible>
        {courseContent?.map((chapter, index) => (
          <AccordionItem
            onClick={() => setSelectedChapterIndex(index)}
            value={chapter?.courseData?.chapterName}
            key={index}
          >
            <AccordionTrigger className="text-md font-medium">
              {index + 1}. {chapter?.courseData?.chapterName}
            </AccordionTrigger>
            <AccordionContent asChild>
              <div className="p-3">
                {chapter?.courseData?.topics.map((topic, index_) => (
                  <h2
                    key={index_}
                    className={`p-2 rounded-lg my-1 ${
                      completedChapters.includes(index)
                        ? "line-through bg-green-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {topic?.topic}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="p-10"></div>
    </div>
  );
}

export default ChaptersListSideBar;
