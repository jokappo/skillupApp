import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


/**
 * Route handler for creating a new user.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} - A response indicating the result of the operation.
 */
// This function handles POST requests to create a new user.
// It checks if the user already exists based on the email provided.
// If the user does not exist, it creates a new user with the provided email and name.
// If the user already exists, it returns the existing user information.

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        {
          message: "Email and name are required",
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // Si l'utilisateur n'existe pas, l'insérer
    if (existingUser.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({ email, name })
        .returning(); // .returning() sans argument retourne toutes les colonnes par défaut

      console.log("New user created:", newUser); // Log l'utilisateur créé pour le débogage  
      return NextResponse.json(
        {
          message: "User created successfully",
          user: newUser[0], // Retourne le premier (et unique) utilisateur inséré
        },
        { status: 201 }// Statut 201 Created pour une ressource nouvelle
      ); 
    } else {
      // Si l'utilisateur existe déjà
      return NextResponse.json(
        {
          message: "User already exists",
          user: existingUser[0], // Retourne l'utilisateur existant
        }); 
    }
  } catch (error) {
    console.error("Error creating user:", error); // Log l'erreur pour le débogage
    return NextResponse.json(
      {
        message: "An error occurred while processing your request",
        error: error.message, // Ne pas exposer toutes les erreurs en prod !
      },
      { status: 500 }// Statut 500 Internal Server Error
    ); 
  }
}