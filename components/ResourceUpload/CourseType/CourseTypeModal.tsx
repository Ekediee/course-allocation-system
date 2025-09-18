"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label";

type courseTypeName = string;

type CourseTypeModalProps = {
  btnName: string;
  onAddCourseType?: () => void;
};

const CourseTypeModal: React.FC<CourseTypeModalProps> = ({btnName, onAddCourseType}) => {
    const [courseTypeName, setCourseTypeName] = useState<courseTypeName>("");
    const { toast } = useToast()

    const handleCreateCourseType = async () => {
        if(courseTypeName == "") {
            toast({
            variant: "destructive",
            title: "Course Type Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }

        const course_type_data = {
            name: courseTypeName,
        };

        try {
            const res = await fetch('/api/manage-uploads/course-type', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(course_type_data),
            });

            if (res.status.toString().startsWith("40")) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: "Something is wrong",
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                const data = await res.json();
                if (onAddCourseType) onAddCourseType();
                toast({
                    variant: "success",
                    title: "Course Type Upload Success",
                    description: data.msg,
                });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Course Type Upload Failed",
            description: (err as Error).message,
            });
        }
        setCourseTypeName("")
    }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-700 hover:bg-blue-400 text-white">
            <Plus className="h-4 w-4" />
            { btnName }
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5 " />
              <DialogTitle className="">Add a Course Type</DialogTitle>
            </div>
            <DialogDescription className="text-center">
              Specify the Name for the Course Type
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col gap-2 ">
              <Label htmlFor="courseType">Course Type Name</Label>
              <input
                id="courseType"
                type="text"
                placeholder="e.g. General"
                className="border p-2 rounded mb-2"
                value={courseTypeName}
                onChange={(e) => setCourseTypeName(e.target.value)}
                required
              />
            </div>
            <div className='flex gap-2 justify-between mt-4'>
              <DialogClose
                className="w-full"
              asChild>
                <Button variant="outline" className="w-full">Cancel</Button>
              </DialogClose>
              <DialogClose
                className="w-full"
              asChild>
              <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleCreateCourseType}>Create Course Type</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CourseTypeModal