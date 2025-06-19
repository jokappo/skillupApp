import { NextResponse } from "next/server";
import axios from "axios";
import { ai } from "../genarate-course-layout/route";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const youtubeBaseUrl = "https://www.googleapis.com/youtube/v3/search";

const PROMPT = `Based on the Chapter name and its Topics, generate detailed content in HTML format for each topic.
Ensure the response is returned in valid JSON format as per the following schema:
{
    chapterName: <string>,
    topics: [
        {
            topic: <string>,
            content: <HTML string>
        }
    ]
}
Input:`;

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    const promises = courseJson?.chapters?.map(async (chapter) => {
      try {
        const config = {
          responseMimeType: "text/plain",
        };
        const model = "gemini-2.0-flash";
        const contents = [
          {
            role: "user",
            parts: [
              {
                text: PROMPT + JSON.stringify(chapter),
              },
            ],
          },
        ];

        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

        const rawResp = response.candidates[0].content.parts[0].text;
        const rawJson = rawResp
          .replace("```json", "")
          .replace("```", "")
          .trim();
        const JSONResp = JSON.parse(rawJson);

        // Génération du contenu pour ce chapitre
        const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

        return {
          courseData: JSONResp,
          youtubeVideo: youtubeData,
        };
      } catch (error) {
        console.error(
          `Error processing chapter ${chapter.chapterName}:`,
          error
        );
        return { chapterName: chapter.chapterName, error: error.message };
      }
    });

    const CourseCountent = await Promise.all(promises);

    //save courseContent
    const save = await db
      .update(coursesTable)
      .set({
        courseContent: CourseCountent,
      })
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      CourseCountent,
    });
  } catch (error) {
    console.error("Error processing course:", error);
    return NextResponse.json({ error: error.message });
  }
}

const GetYoutubeVideo = async (topic) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error(
        "La clé API YouTube n'est pas définie dans les variables d'environnement."
      );
    }

    const params = {
      part: "snippet",
      maxResults: 4,
      q: topic,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const response = await axios.get(youtubeBaseUrl, { params });

    if (!response.data.items) {
      throw new Error("Aucune vidéo trouvée pour le sujet donné.");
    }

    const youtubeVideoListResponse = response?.data?.items;
    const youtubeVideoList = [];

    youtubeVideoListResponse.forEach((item) => {
      const data = {
        videoId: item?.id?.videoId,
        title: item?.snippet?.title,
        description: item?.snippet?.description,
      };
      youtubeVideoList.push(data);
    });

    console.log("______youtubeVideoList_______", youtubeVideoList);
    return youtubeVideoList;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des vidéos YouTube :",
      error.message
    );

    // Ajout de détails supplémentaires
    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("Request sent but no response received:", error.request);
    } else {
      console.error("Erreur non liée à la requête :", error.message);
    }

    return [];
  }
};
