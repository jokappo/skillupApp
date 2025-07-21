"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function AddNewCourseDialogue({ children }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    noOfChapiters: 1,
    includeVideo: false,
    level: "",
    category: "",
  });
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      includeVideo: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.level) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.noOfChapiters <= 0 || isNaN(formData.noOfChapiters)) {
      toast.error("Number of chapters must be a valid number greater than 0.");
      return;
    }

    const courseId = uuidv4();

    try {
      setLoading(true);
      const result = await axios.post("/api/genarate-course-layout", {
        ...formData,
        courseId: courseId,
      });

      toast.success(result.data.message, {
        duration: 5000,
        position: "top-right",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      
      if (result?.data?.message === "limite exceeded") {
        toast.error("You have reached the limit of courses you can create. please upgrade your plan.");
        router.push('/workspace/billing')
        return;
      }

      // Reset form data
      setFormData({
        name: "",
        description: "",
        noOfChapiters: 1,
        includeVideo: false,
        level: "",
        category: "",
      });
      //
      router.push('/workspace/edit-course/'+result?.data?.data?.courseId)
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course Using AI</DialogTitle>
            <DialogDescription asChild>
              <div className="grid gap-4">
                {/* Course Name */}
                <div className="grid gap-2">
                  <label htmlFor="courseName" className="font-semibold">
                    Course Name
                  </label>
                  <Input
                    placeholder="Course Name"
                    id="courseName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {/* Course Description */}
                <div className="grid gap-2">
                  <label htmlFor="courseDescription" className="font-semibold">
                    Course Description
                  </label>
                  <Textarea
                    placeholder="Course Description"
                    id="courseDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                {/* Number of Chapters */}
                <div className="grid gap-2">
                  <label htmlFor="numberOfChapters" className="font-semibold">
                    No. of Chapters
                  </label>
                  <Input
                    placeholder="Number of Chapters"
                    type="number"
                    id="numberOfChapters"
                    name="noOfChapiters"
                    value={formData.noOfChapiters}
                    onChange={handleChange}
                  />
                </div>
                {/* Include Video */}
                <div className="flex items-center gap-3">
                  <label htmlFor="includeVideo" className="font-semibold">
                    Include Video
                  </label>
                  <Switch
                    id="includeVideo"
                    checked={formData.includeVideo}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                {/* Difficulty Level */}
                <div className="grid gap-2">
                  <label htmlFor="difficultyLevel" className="font-semibold">
                    Difficulty Level
                  </label>
                  <Select
                    id="difficultyLevel"
                    value={formData.level}
                    onValueChange={(value) =>
                      handleSelectChange("level", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="advance">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Category */}
                <div className="grid gap-2">
                  <label htmlFor="category" className="font-semibold">
                    Category
                  </label>
                  <Input
                    placeholder="Category (Separate by comma)"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                {/* Submit Button */}
                <div className="mt-4">
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-full flex justify-center gap-x-2 items-center">
                        <div className="w-3 h-3 rounded-full bg-[#d991c2] animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-[#9869b8] animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-[#6756cc] animate-bounce"></div>
                      </div>
                    ) : (
                      <>
                        <Sparkle className="mr-2" /> Create Course
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewCourseDialogue;
