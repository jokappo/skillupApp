import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <div>
      <h1 className="text-3xl font-bold underline">
        Welcome to Next.js with Tailwind CSS!
      </h1>

      <Button type="primary"> premer</Button>
      <UserButton></UserButton>
    </div>
    </>
  );
}
