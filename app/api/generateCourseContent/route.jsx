import { NextResponse } from "next/server";
import { ai } from "../genarate-course-layout/route";

const PROMPT = `Depends on Chapter name and Topic 
Generate content for each topic in HTML 
and give response in JSON format. 
Schema:{
    chapterName:<>,
    {
        topic:<>,
        content:<>
        }
}
: User Input:`;

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
        
        console.log("Response:", response.candidates[0].content.parts[0].text);
        const rawResp = response.candidates[0].content.parts[0].text;
        const rawJson = rawResp.replace("```json", "").replace("```", "").trim();
        const JSONResp = JSON.parse(rawJson);

        // Génération du contenu pour ce chapitre
        return JSONResp;
      } catch (error) {
        console.error(`Error processing chapter ${chapter.chapterName}:`, error);
        return { chapterName: chapter.chapterName, error: error.message };
      }
    });

    const CourseCountent = await Promise.all(promises);

    return NextResponse.json({
      courseName: courseTitle,
      CourseCountent,
    });
  } catch (error) {
    console.error("Error processing course:", error);
    return NextResponse.json({ error: error.message });
  }
}
