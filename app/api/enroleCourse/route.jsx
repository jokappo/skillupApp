import { db } from "@/config/db";
import { coursesTable, enroleCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({
        message: "User not authenticated",
        error: true,
        success: false,
      });
    }

    if (!courseId) {
      return NextResponse.json({
        message: "Course ID not provided",
        error: true,
        success: false,
      });
    }

    // Vérifiez si l'utilisateur est déjà inscrit au cours
    const enroleCourses = await db
      .select()
      .from(enroleCourseTable)
      .where(
        and(
          eq(
            enroleCourseTable.userEmail,
            user?.primaryEmailAddress?.emailAddress
          ),
          eq(enroleCourseTable.cid, courseId)
        )
      );

    if (enroleCourses.length === 0) {
      // Inscrire l'utilisateur au cours
      const response = await db
        .insert(enroleCourseTable)
        .values({
          cid: courseId,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        })
        .returning();

      return NextResponse.json({
        message: "User successfully enrolled in the course",
        data: response,
        success: true,
        error: false,
      });
    }

    return NextResponse.json({
      message: "User already enrolled in the course",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error enrolling user in the course:", error);
    return NextResponse.json({
      message: "An error occurred during enrollment",
      error: true,
      success: false,
    });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!user) {
      return NextResponse.json({
        message: "User not authenticated",
        error: true,
        success: false,
      });
    }

    const email = user?.primaryEmailAddress?.emailAddress;

    let response;

    if (courseId) {
      response = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enroleCourseTable,
          eq(coursesTable.cid, enroleCourseTable.cid)
        )
        .where(
          and(
            eq(coursesTable.cid, courseId),
            eq(enroleCourseTable.userEmail, email)
          )
        )
      if (response.length === 0) {
        return NextResponse.json({
          message: "No courses found for the user",
          data: [],
          success: true,
          error: false,
        });
      }

      return NextResponse.json({
        message: "Course fetched successfully",
        data: response[0],
        success: true,
        error: false,
      });
    } else {
      response = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enroleCourseTable,
          eq(coursesTable.cid, enroleCourseTable.cid)
        )
        .where(
          eq(
            enroleCourseTable.userEmail,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(desc(enroleCourseTable.id));

      if (response.length === 0) {
        return NextResponse.json({
          message: "No courses found for the user",
          data: [],
          success: true,
          error: false,
        });
      }

      return NextResponse.json({
        message: "Courses fetched successfully",
        data: response,
        success: true,
        error: false,
      });
    }


  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json({
      message: "An error occurred while fetching courses",
      error: true,
      success: false,
    });
  }
}
