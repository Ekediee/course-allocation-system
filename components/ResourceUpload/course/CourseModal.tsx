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

const CourseModal: React.FC<CourseModalProps> = ({btnName, onAddCourse, course, isOpen, onClose}) => {
    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [courseUnit, setCourseUnit] = useState('');
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { 
        setIsUploading, 
        fetchBulletinName, 
        fetchSchoolName,
        fetchDepartmentNameBySchool,
        fetchProgramNameByDepartment,
        fetchSpecializationNameByProgram,
        fetchSemesters,
        fetchLevels,
        fetchCourseTypes,
        showDeptCombo,
        showProgCombo,
        showSpecCombo,
        isEditModalOpen
    } = useAppContext();
    const [selectedBulletin, setSelectedBulletin] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCourseType, setSelectedCourseType] = useState('');

    const { toast } = useToast()

    useEffect(() => {
        if (course) {
            setCourseCode(course.code);
            setCourseTitle(course.title);
            setCourseUnit(course?.unit?.toString());
            setSelectedBulletin(course.bulletin?.id || '');
            setSelectedSchool(course.program?.department?.school?.id || '');
            setSelectedDepartment(course.program?.department?.id || '');
            setSelectedProgram(course.program?.id || '');
            setSelectedSpecialization(course.specialization?.id || '');
            setSelectedSemester(course.semester?.id || '');
            setSelectedLevel(course.level?.id || '');
            setSelectedCourseType(course.course_type?.id || '');
        }else {
            // Reset fields when adding a new course
            setCourseCode('');
            setCourseTitle('');
            setCourseUnit('');
            setSelectedBulletin('');
            setSelectedSchool('');
            setSelectedDepartment('');
            setSelectedProgram('');
            setSelectedSpecialization('');
            setSelectedSemester('');
            setSelectedLevel('');
            setSelectedCourseType('');
        }
    }, [course]);
    
    useEffect(() => {
        if (!isOpen && !course) { // Only reset if dialog is closing AND it's not an edit session
            setCourseCode('');
            setCourseTitle('');
            setCourseUnit('');
            setSelectedBulletin('');
            setSelectedSchool('');
            setSelectedDepartment('');
            setSelectedProgram('');
            setSelectedSpecialization('');
            setSelectedSemester('');
            setSelectedLevel('');
            setSelectedCourseType('');
        }
    }, [isOpen, course]);
    
    const handleSaveCourse = async () => {
        if(!courseCode || !courseTitle || !courseUnit || !selectedProgram || !selectedLevel || !selectedSemester || !selectedBulletin) {
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
            unit: parseInt(courseUnit),
            program_id: selectedProgram,
            level_id: selectedLevel,
            semester_id: selectedSemester,
            specialization_id: selectedSpecialization,
            bulletin_id: selectedBulletin,
            course_type_id: selectedCourseType
        };

        const url = course ? `/api/manage-uploads/course?id=${course.program_course_id}` : '/api/manage-uploads/course';
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

        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.toLowerCase().endsWith('.xlsx');

        if (!isXLSX) {
        toast({
            variant: "destructive",
            title: "❌ Wrong File Type",
            description: 'Please upload a valid Excel file.'
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
        formData.append('bulletin_id', selectedBulletin || '');
        formData.append('program_id', selectedProgram || '');
        formData.append('specialization_id', selectedSpecialization || '');
        formData.append('semester_id', selectedSemester || '');
        formData.append('level_id', selectedLevel || '');
        formData.append('course_type_id', selectedCourseType || '');

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
                title: "❌ " + data.message,
                description: (
                    <p className="whitespace-pre-wrap">
                    {data.error}
                    </p>
                )
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

    const { data: bulletins = [], isLoading: loadingBulletins } = useQuery<Items[]>({
        queryKey: ["bulletins"],
        queryFn: fetchBulletinName,
    });

    const { data: schools = [], isLoading: loadingSchools } = useQuery<Items[]>({
        queryKey: ["schools"],
        queryFn: fetchSchoolName,
    });

    const { data: departments = [], isLoading: loadingDepartments } = useQuery<Items[]>({
        queryKey: ["departments", selectedSchool],
        queryFn: () => fetchDepartmentNameBySchool(selectedSchool!),
        enabled: !!selectedSchool,
    });
    
    const { data: programs = [], isLoading: loadingProgram } = useQuery<Items[]>({
        queryKey: ["programs", selectedDepartment],
        queryFn: () => fetchProgramNameByDepartment(selectedDepartment!),
        enabled: !!selectedDepartment,
    });

    const { data: specializations = [], isLoading: loadingSpecializations } = useQuery<Items[]>({
        queryKey: ["specializations", selectedProgram],
        queryFn: () => fetchSpecializationNameByProgram(selectedProgram!),
        enabled: !!selectedProgram,
    });

    const { data: semesterResult, isLoading: loadingSemester } = useQuery<Items[]>({
        queryKey: ["semesters"],
        queryFn: fetchSemesters,
    });
    const semesters = semesterResult ?? [];

    const { data: levelResult, isLoading: loadingLevel } = useQuery<Items[]>({
        queryKey: ["levels"],
        queryFn: fetchLevels,
    });
    const levels = levelResult ?? [];

    const { data: courseTypesResult, isLoading: loadingCourseTypes } = useQuery<Items[]>({
        queryKey: ["courseTypes"],
        queryFn: fetchCourseTypes,
    });
    const courseTypes = courseTypesResult ?? [];
    
  return (
    <>
        <Dialog open={isOpen} onOpenChange={onClose}>
            {isEditModalOpen === false && (
                <DialogTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-400 text-white">
                    <Plus className="h-4 w-4" />
                    { btnName }
                    </Button>
                </DialogTrigger>
            )}
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
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="bulletin">Bulletin</Label>
                            {!loadingBulletins && <ComboboxMain data={bulletins} onSelect={setSelectedBulletin} initialValue={selectedBulletin} />}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="school">Select School</Label>
                            {!loadingSchools && <ComboboxMain data={schools} onSelect={(value) => {
                                setSelectedSchool(value);
                                // setSelectedDepartment('');
                                // setSelectedProgram('');
                                // setSelectedSpecialization('');
                            }} initialValue={selectedSchool} />}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            {showDeptCombo && <><Label htmlFor="department">Select Department</Label>
                            <ComboboxMain data={departments} onSelect={(value) => {
                                setSelectedDepartment(value);
                                // setSelectedProgram('');
                                // setSelectedSpecialization('');
                            }} initialValue={selectedDepartment} /></>}
                        </div>
                        <div className="w-full">
                            {showProgCombo && <><Label htmlFor="program">Select Program</Label>
                            <ComboboxMain data={programs} onSelect={(value) => {
                                setSelectedProgram(value);
                                // setSelectedSpecialization('');
                            }} initialValue={selectedProgram} /></>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            {showSpecCombo && <><Label htmlFor="specialization">Select Specialization (Optional)</Label>
                            <ComboboxMain data={specializations} onSelect={setSelectedSpecialization} initialValue={selectedSpecialization} /></>}
                        </div>
                        <div className="w-full">
                            {showSpecCombo && <><Label htmlFor="semester">Select Semester</Label>
                            <ComboboxMain data={semesters} onSelect={setSelectedSemester} initialValue={selectedSemester} /></>}
                        </div>
                    </div>
                    <div className="w-full">
                        {showSpecCombo && <><Label htmlFor="level">Select Level</Label>
                        <ComboboxMain data={levels} onSelect={setSelectedLevel} initialValue={selectedLevel} /></>}
                    </div>
                    <div className="w-full">
                        {showSpecCombo && <><Label htmlFor="courseType">Select Course Type</Label>
                        <ComboboxMain data={courseTypes} onSelect={setSelectedCourseType} initialValue={selectedCourseType} /></>}
                    </div>
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
                <Badge
                    variant="secondary"
                    className="bg-red-500 gap-3 mt-2 text-white dark:bg-blue-600"
                >
                    <Info />
                    OR Use button below to upload an Excel file for batch upload.
                </Badge>
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="file">Batch Upload</Label>
                    <Input id="file" type="file" accept=".xlsx" onChange={handleFileChange} onClick={() => setOpen(true)} />
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
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleSaveCourse}>{course ? "Save Changes" : "Create Course"}</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CourseModal