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
import { Info, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from '@/contexts/ContextProvider'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ComboboxMain, Items } from "@/components/ComboboxMain";
import { useQuery } from "@tanstack/react-query";

type CourseModalProps = {
  btnName: string;
  onAddCourse?: () => void;
  course?: any;
  isOpen?: boolean;
  onClose?: () => void;
};

const CourseMainModal: React.FC<CourseModalProps> = ({btnName, onAddCourse, course, isOpen, onClose}) => {
    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [courseUnit, setCourseUnit] = useState('');
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { 
        // setIsUploading, 
        // fetchBulletinName, 
        // fetchSchoolName,
        // fetchDepartmentNameBySchool,
        // fetchProgramNameByDepartment,
        // fetchSpecializationNameByProgram,
        // fetchSemesters,
        // fetchLevels,
        // fetchCourseTypes,
        // showDeptCombo,
        // showProgCombo,
        // showSpecCombo,
    } = useAppContext();
    // const [selectedBulletin, setSelectedBulletin] = useState('');
    // const [selectedSchool, setSelectedSchool] = useState('');
    // const [selectedDepartment, setSelectedDepartment] = useState('');
    // const [selectedProgram, setSelectedProgram] = useState('');
    // const [selectedSpecialization, setSelectedSpecialization] = useState('');
    // const [selectedSemester, setSelectedSemester] = useState('');
    // const [selectedLevel, setSelectedLevel] = useState('');
    // const [selectedCourseType, setSelectedCourseType] = useState('');

    const { toast } = useToast()

    useEffect(() => {
        if (course) {
            setCourseCode(course.code);
            setCourseTitle(course.title);
            setCourseUnit(course?.unit?.toString());
        }else {
            // Reset fields when adding a new course
            setCourseCode('');
            setCourseTitle('');
            setCourseUnit('');
        }
    }, [course]);
    
    useEffect(() => {
        if (!isOpen && !course) { // Only reset if dialog is closing AND it's not an edit session
            setCourseCode('');
            setCourseTitle('');
            setCourseUnit('');
        }
    }, [isOpen, course]);
    
    const handleSaveCourse = async () => {
        if(!courseCode || !courseTitle || !courseUnit) {
            toast({
            variant: "destructive",
            title: "Course Creation Failed",
            description: "Please fill in all required fields"
            })
            return;
        }

        const course_data = {
            code: courseCode,
            title: courseTitle,
            unit: parseInt(courseUnit)
        };

        const url = course ? `/api/manage-uploads/course/main?id=${course.id}` : '';
        const method = course ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(course_data),
            });

            if (!res.ok) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: data.title,
                    description: data.error || "An unknown error occurred."
                });
                return;
            }

            const data = await res.json();
            if (onAddCourse) onAddCourse();
            toast({
                variant: "success",
                title: course ? "Course Updated Successfully" : "Course Upload Success",
                description: data.msg,
            });

            // if (!course) {
            //     setCourseCode('');
            //     setCourseTitle('');
            //     setCourseUnit('');
            //     setSelectedSpecialization('');
            // }
            if (onClose) onClose();

        } catch (err) {
        toast({
            variant: "destructive",
            title: course ? "Course Update Failed" : "Course Upload Failed",
            description: (err as Error).message,
            });
        }
    }

    
  return (
    <>
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-400 text-white">
                <Plus className="h-4 w-4" />
                { btnName }
                </Button>
            </DialogTrigger> */}
            <DialogContent className="md:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <div className="flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5 " />
                    <DialogTitle className="">{course ? "Edit Course" : "Add a Course"}</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Fill in the form below to {course ? "edit the" : "add a new"} course.
                </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-2 ">
                    <div className="flex gap-2 mt-2">
                        <div className="w-full">  
                            <Label htmlFor="course_code">Course Code</Label>
                            <Input
                                id="course_code"
                                type="text"
                                placeholder="e.g. COSC101"
                                className="border p-2 rounded"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="course_title">Course Title</Label>
                            <Input
                                id="course_title"
                                type="text"
                                placeholder="e.g. Introduction to Computer Science"
                                className="border p-2 rounded"
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Label htmlFor="unit" className="mt-2">Course Unit</Label>
                    <Input
                        id="unit"
                        type="number"
                        placeholder="e.g. 3"
                        className="border p-2 rounded"
                        value={courseUnit}
                        onChange={(e) => setCourseUnit(e.target.value)}
                        required
                    />
                </div>
                <div className='flex gap-2 justify-between mt-4'>
                    <DialogClose  
                    className="w-full"
                    asChild>
                    <Button variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
                    </DialogClose>
                    <DialogClose  
                    className="w-full"
                    asChild>
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleSaveCourse}>Save Changes</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CourseMainModal