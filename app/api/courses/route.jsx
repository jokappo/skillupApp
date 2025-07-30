import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({
        message: "User not authenticated",
        error: true,
        success: false,
      });
    }

    const email = user?.primaryEmailAddress?.emailAddress;
    let result;

    // 👉 Corrigé : test correct pour courseId = "0"
    if (courseId === "0") {
      result = await db
        .select()
        .from(coursesTable)
        .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);

      return NextResponse.json({
        message: "Course details fetched successfully",
        data: result,
        success: true,
        error: false,
      });
    }

    // 👉 si courseId présent (autre que 0)
    if (courseId) {
      result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId));

      if (result.length === 0) {
        return NextResponse.json({
          message: "Course not found",
          error: true,
          success: false,
        });
      }

      return NextResponse.json({
        message: "Course details fetched successfully",
        data: result[0],
        success: true,
        error: false,
      });
    }

    // 👉 Sinon : cours créés par l'utilisateur connecté
    result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, email))
      .orderBy(desc(coursesTable.id));

    if (result.length === 0) {
      return NextResponse.json({
        message: "No courses found for this user",
        error: true,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Courses fetched successfully",
      data: result,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({
      message: "An error occurred while fetching courses",
      error: true,
      success: false,
    });
  }
}
