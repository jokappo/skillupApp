"use client";
import { Gift } from "lucide-react";
import React from "react";
import { motion } from "framer-motion"; // Import de Framer Motion

function ChapiterTopicList({ course }) {
  const courseLayout = course?.couseJson?.course;

  return (
    <div>
      <h2 className="font-bold text-3xl mt-10">Chapter & Topics</h2>
      <div className="flex flex-col items-center justify-center mt-10">
        {courseLayout?.chapters.map((chapter, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }} // Différé par chapitre
          >
            {/* Chapter Info */}
            <div className="p-4 border shadow rounded-xl bg-primary text-white">
              <h2 className="text-center">Chapter {index + 1}</h2>
              <h2 className="font-bold text-lg text-center">
                {chapter.chapterName}
              </h2>
              <h2 className="text-xs flex justify-between gap-16">
                <span>Duration: {chapter?.duration}</span>
                <span>No. Of Topics: {chapter?.topics?.length}</span>
              </h2>
            </div>

            {/* Topics List */}
            <div>
              {chapter?.topics.map((topic, topicIndex) => (
                <motion.div
                  className="flex flex-col items-center"
                  key={topicIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: topicIndex * 0.2 }}
                >
                  {/* Vertical line before topic */}
                  <div className="h-10 bg-gray-300 w-1"></div>

                  {/* Topic row */}
                  <div className="flex items-center gap-5">
                    {/* Left Side Topic */}
                    <span
                      className={`${
                        topicIndex % 2 === 0
                          ? "text-transparent"
                          : "text-gray-800"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>

                    {/* Topic Index */}
                    <h2 className="text-center rounded-full bg-gray-300 px-6 text-gray-500 p-4">
                      {topicIndex + 1}
                    </h2>

                    {/* Right Side Topic */}
                    <span
                      className={`${
                        topicIndex % 2 !== 0
                          ? "text-transparent"
                          : "text-gray-800"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>
                  </div>

                  {/* Vertical line after last topic */}
                  {topicIndex === chapter?.topics?.length - 1 && (
                    <>
                      <div className="h-10 bg-gray-300 w-1"></div>
                      <div className="flex items-center gap-5">
                        <Gift className="text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4" />
                      </div>
                      <div className="h-10 bg-gray-300 w-1"></div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Finish Section */}
        <motion.div
          className="p-4 border shadow rounded-xl bg-green-600 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: courseLayout?.chapters.length * 0.3,
          }}
        >
          <h2>Finish</h2>
        </motion.div>
      </div>
    </div>
  );
}

export default ChapiterTopicList;
