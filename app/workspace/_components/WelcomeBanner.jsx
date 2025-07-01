"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { IoMdArrowForward } from "react-icons/io";

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div className="p-5 bg-gradient-to-r from-purple-900  to-cyan-950 rounded-xl flex items-center justify-between">
      <div className="">
        <h1 className="text-2xl text-neutral-50 font-bold">
          Welcome to{" "}
          <span className="bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">
            Skill Up
          </span>{" "}
          , {user?.firstName} 😶‍🌫️
        </h1>
        <p className="mt-2 text-neutral-50">
          Ready to learn something new today?
        </p>
      </div>
      <div>
        <Button>Explore Courses <IoMdArrowForward /> </Button>
      </div>
    </div>
  );
}

export default WelcomeBanner;
