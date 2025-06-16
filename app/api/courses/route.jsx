import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return new Response("Course ID is required", { status: 400 });
  }

  const result = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.cid, courseId));
    if (result.length === 0) {
      return NextResponse.json({
        message: "Course not found",
        error: true,
        success: false
      })
    }
    console.log("courses details: ", result[0])

  return NextResponse.json({
    message: "Course details fetched successfully",
    data: result[0],
    success: true,
    error: false
  });
}
