import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const PROMPT = `
Genrate Learning Course depends on following details. 
In which Make sure to add Course Name, Description,
Course Banner Image Prompt (Create a modern
, flat-style 2D digital illustration representing user Topic.
Include UI/UX elements such as mockup screens, text blocks,
icons, buttons, and creative workspace tools. Add symbolic
elements related to user Course, like sticky notes, design 
components, and visual aids. Use a vibrant color palette
(blues, purples, oranges) with a clean, professional look.
The illustration should feel creative, tech-savvy,
and educational, ideal for visualizing concepts in user Course)
for Course Banner in 3d format Chapter Name, ,
Topic under each chapters , Duration for each chapters etc, 
in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",

"bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
     
      }
    ]
  }
}

, User Input: 


`;

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req, res) {
  const { courseId, ...formData } = await req.json();
  const user = await currentUser();

  const { has } = await auth();

  const isFree = has({ plan: "free" });
  // ou selon ta logique exacte, adapte :
  const isStarter = has({ plan: "starter" });
  const isPremium = has({ plan: "premium" });

  // To run this code you need to install the following dependencies:
  // npm install @google/genai mime
  // npm install -D @types/node

  const config = {
    responseMimeType: "text/plain",
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  //if user already created any course
  // Vérifie la limite uniquement si le plan est free
  if (isFree) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(
        eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress)
      );
    if (result?.length >= 1) {
      return NextResponse.json({
        message: "limite exceeded",
      });
    }
  }

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  console.log("Response:", response.candidates[0].content.parts[0].text);
  const rawResp = response.candidates[0].content.parts[0].text;
  const rawJson = rawResp.replace("```json", "").replace("```", "").trim();
  const JSONResp = JSON.parse(rawJson);

  const imagePrompt = JSONResp?.course?.bannerImagePrompt;
  console.log("image prompt : ", imagePrompt);

  //image generation
  const bannerImageUrl = await GenerateImage(imagePrompt);
  console.log("Banner Image URL:", bannerImageUrl);

  //save to database
  const result = await db.insert(coursesTable).values({
    ...formData,
    couseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    cid: courseId,
    bannerImageUrl: bannerImageUrl,
  });

  return NextResponse.json({
    message: "Course generated successfully",
    data: courseId,
  });
}

const GenerateImage = async (imagePrompt) => {
  try {
    const BASE_URL = "https://aigurulab.tech";
    const result = await axios.post(
      BASE_URL + "/api/generate-image",
      {
        width: 1024,
        height: 1024,
        input: imagePrompt, //ImagePrompt from the json response
        model: "flux", //'flux'
        aspectRatio: "16:9", //Applicable to Flux model only
      },
      {
        headers: {
          "x-api-key": process?.env?.AI_GURU_LAB_API_KEY, // Your API Key
          "Content-Type": "application/json", // Content Type
        },
      }
    );
    console.log(result.data.image); //Output Result: Base 64 Image
    return result.data.image;
  } catch (error) {
    console.error("Error generating image:", error);
    return "";
  }
};
