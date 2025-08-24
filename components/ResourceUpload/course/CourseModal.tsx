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
import Link from "next/link"
import { Info, Plus } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { SchoolType, SchoolTypes, useAppContext } from '@/contexts/ContextProvider'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fi } from "zod/v4/locales";
import { Combobox } from "@/components/ComboBox";
import { ComboboxMain, Items } from "@/components/ComboboxMain";
import { useQueries, useQuery } from "@tanstack/react-query";

type programName = string;
type programAcronym = string;

type CourseModalProps = {
  btnName: string;
  onAddCourse?: () => void;
};

const CourseModal: React.FC<CourseModalProps> = ({btnName, onAddCourse}) => {
    const [programName, setProgramName] = useState<programName>();
    const [programAcronym, setProgramAcronym] = useState<programAcronym>();
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { 
        setIsUploading, 
        fetchBulletinName, 
        fetchSchoolName,
        fetchDepartmentName,
        fetchDepartmentNameBySchool,
        fetchProgramNameByDepartment,
        fetchProgramName,
        fetchSessionName,
        showDeptCombo,
        showProgCombo,
        fetchSemesters,
        fetchLevels,
    } = useAppContext();
    const [selectedBulletin, setSelectedBulletin] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const { toast } = useToast()
    
    const handleCreateCourse = async () => {
        if(programName == "" || programAcronym == "") {
            toast({
            variant: "destructive",
            title: "program Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }else if(programName?.trim() === programAcronym?.trim()) {
            toast({
            variant: "destructive",
            title: "Course Creation Failed",
            description: "Your program name and acronym cannot be the same"
            })
            return;
        }

        const course_data = {
            name: programName,
            department_id: selectedDepartment,
            acronym: programAcronym
        };

        try {
            const res = await fetch('/api/manage-uploads/course', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(course_data),
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
                
                // Fetch course data
                if (onAddCourse) onAddCourse();
                toast({
                    variant: "success",
                    title: "Course Upload Success",
                    description: data.msg,
                });

            }


            
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Course Upload Failed",
            description: (err as Error).message,
            });
        }
        setProgramName("")
        setProgramAcronym(""); 
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file){
        toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: 'No file selected.'
        });
        setFile(null);
        setOpen(false);
        return;
        }

        const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

        if (!isCsv) {
        toast({
            variant: "destructive",
            title: "❌ Wrong File Type",
            description: 'Please upload a valid CSV file.'
        });
        setFile(null);
        return;
        }

        setFile(file);
    };

    const handleBatchUpload = async () => {
        setIsUploading(true);
        if (!file) {
        toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: 'No file selected.'
        });
        return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('department_id', selectedDepartment);

        try {
        
        const res = await fetch('/api/manage-uploads/course/batch', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {

            if (onAddCourse) onAddCourse();
            toast({
            variant: "success",
            title: "✅ Upload successful",
            description: data.message
            });
            
        } else {
            toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: data.error
            });
        }
        } catch (err) {
            alert('❌ Upload failed');
            console.error(err);
        }finally {
            setIsUploading(false);
            setOpen(false);
            setFile(null);
        }
    };

    const { data: bulletins = [], isLoading: loadingBulletins } = useQuery({
        queryKey: ["bulletins"],
        queryFn: fetchBulletinName,
    });

    const bulletinName = Array.isArray(bulletins) ? bulletins : [];

    const { data: schools = [], isLoading: loadingSchools } = useQuery({
        queryKey: ["schools"],
        queryFn: fetchSchoolName,
    });

    const schoolName = Array.isArray(schools) ? schools : [];

    const { data: departments = [], isLoading: loadingDepartments } = useQuery({
        queryKey: ["departments", selectedSchool],
        queryFn: () => fetchDepartmentNameBySchool(selectedSchool!),
        enabled: !!selectedSchool,
    });

    const departmemtName = Array.isArray(departments) ? departments : [];
    
    const { data: programs = [], isLoading: loadingProgram } = useQuery({
        queryKey: ["departments", selectedDepartment],
        queryFn: () => fetchProgramNameByDepartment(selectedDepartment!),
        enabled: !!selectedDepartment,
    });

    const programNam = Array.isArray(programs) ? programs : [];

    const { data: semesters = [], isLoading: loadingSemester } = useQuery({
        queryKey: ["semesters"],
        queryFn: fetchSemesters,
    });

    const semesterName = Array.isArray(semesters) ? semesters : [];

    const { data: levels = [], isLoading: loadingLevel } = useQuery({
        queryKey: ["levels"],
        queryFn: fetchLevels,
    });

    const levelName = Array.isArray(levels) ? levels : [];

    console.log("List of levels:", levelName);
        
    
  return (
    <>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-400 text-white">
                <Plus className="h-4 w-4" />
                { btnName }
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[800px] w-full">
                <DialogHeader>
                <div className="flex items-center justify-center gap-2">
                    
                    <Plus className="h-5 w-5 " />
                
                <DialogTitle className="">Add a Course</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Specify the Name and Acronym for the Program
                </DialogDescription>
                </DialogHeader>
                {/* Modal body content here */}
                <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-2 ">
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="bulletin">Bulletin</Label>
                            {!loadingBulletins && <ComboboxMain data={bulletinName} onSelect={setSelectedBulletin} />}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="school">Select School</Label>
                            {!loadingSchools && <ComboboxMain data={schoolName} onSelect={setSelectedSchool} />}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            {showDeptCombo && <><Label htmlFor="department">Select Department</Label>
                            <ComboboxMain data={departmemtName} onSelect={setSelectedDepartment} /></>}
                        </div>
                        <div className="w-full">
                            {showProgCombo && <><Label htmlFor="program">Select Program</Label>
                            <ComboboxMain data={programNam} onSelect={setSelectedProgram} /></>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            {showProgCombo && <><Label htmlFor="semester">Select Semester</Label>
                            <ComboboxMain data={semesterName} onSelect={setSelectedSemester} /></>}
                        </div>
                        <div className="w-full">
                            {showProgCombo && <><Label htmlFor="level">Select Level</Label>
                            <ComboboxMain data={levelName} onSelect={setSelectedLevel} /></>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">  
                            <div className="flex flex-col gap-2"> 
                                <Label htmlFor="program" className="mt-2">Course Code</Label>
                                <input
                                    type="text"
                                    placeholder="e.g. COSC101"
                                    className="border p-2 rounded mb-2"
                                    value={programName}
                                    onChange={(e) => setProgramName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title" className="mt-2">Course Title</Label>
                                <input
                                    type="text"
                                    placeholder="e.g. Computer Science"
                                    className="border p-2 rounded mb-2"
                                    value={programName}
                                    onChange={(e) => setProgramName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Label htmlFor="unit">Course Unit</Label>
                    <input
                    type="number"
                    placeholder="e.g. 3"
                    className="border p-2 rounded"
                    value={programAcronym}
                    onChange={(e) => setProgramAcronym(e.target.value)}
                    required
                    />
                </div>
                <Badge
                    variant="secondary"
                    className="bg-red-500 gap-3 mt-2 text-white dark:bg-blue-600"
                >
                    <Info />
                    OR Use button below to upload a CSV file for batch upload.
                </Badge>
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="file">Batch Upload</Label>
                    <Input id="file" type="file" accept=".csv" onChange={handleFileChange} onClick={() => setOpen(true)} />
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
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleCreateCourse}>Create Department</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CourseModal