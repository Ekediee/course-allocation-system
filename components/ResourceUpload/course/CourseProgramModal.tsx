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
import { Info, Link, Plus } from "lucide-react";
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
  isOpenProgramCourseModal?: boolean;
  onClose?: () => void;
};

const CourseProgramModal: React.FC<CourseModalProps> = ({btnName, onAddCourse, course, isOpenProgramCourseModal, onClose}) => {
    
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
        fetchCoursesMainList,
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
    const [selectedCourse, setSelectedCourse] = useState('');

    const { toast } = useToast()

    
    useEffect(() => {
        if (!isOpenProgramCourseModal && !course) { // Only reset if dialog is closing AND it's not an edit session
            setSelectedBulletin('');
            setSelectedSchool('');
            setSelectedDepartment('');
            setSelectedProgram('');
            setSelectedSpecialization('');
            setSelectedSemester('');
            setSelectedLevel('');
        }
    }, [isOpenProgramCourseModal, course]);
    
    const handleSaveCourse = async () => {
        if(!selectedProgram || !selectedLevel || !selectedSemester || !selectedBulletin || !selectedCourse) {
            toast({
            variant: "destructive",
            title: "Course Creation Failed",
            description: "Please fill in all required fields"
            })
            return;
        }

        const course_data = {
            program_id: selectedProgram,
            level_id: selectedLevel,
            semester_id: selectedSemester,
            specialization_id: selectedSpecialization,
            bulletin_id: selectedBulletin,
            course_id: selectedCourse
        };

        const url = '/api/manage-uploads/course/main';
        const method ='POST';

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
                title: "Linking Course to Program successful",
                description: data.msg,
            });

            if (onClose) onClose();

        } catch (err) {
        toast({
            variant: "destructive",
            title: "Linking Course to Program Failed",
            description: (err as Error).message,
            });
        }
    }

    const { data: bulletins = [], refetch: refetchBulletins, isLoading: loadingBulletins } = useQuery<Items[]>({
        queryKey: ["bulletins"],
        queryFn: fetchBulletinName,
    });

    const { data: schools = [], refetch: refetchSchools, isLoading: loadingSchools } = useQuery<Items[]>({
        queryKey: ["schools"],
        queryFn: fetchSchoolName,
    });

    const { data: departments = [], refetch: refetchDepartment, isLoading: loadingDepartments } = useQuery<Items[]>({
        queryKey: ["departments", selectedSchool],
        queryFn: () => fetchDepartmentNameBySchool(selectedSchool!),
        enabled: !!selectedSchool,
    });
    
    const { data: programs = [], refetch: refetchPrograms, isLoading: loadingProgram } = useQuery<Items[]>({
        queryKey: ["programs", selectedDepartment],
        queryFn: () => fetchProgramNameByDepartment(selectedDepartment!),
        enabled: !!selectedDepartment,
    });

    const { data: specializations = [], refetch: refetchSpecializations, isLoading: loadingSpecializations } = useQuery<Items[]>({
        queryKey: ["specializations", selectedProgram],
        queryFn: () => fetchSpecializationNameByProgram(selectedProgram!),
        enabled: !!selectedProgram,
    });

    const { data: semesterResult, refetch: refetchSemesters, isLoading: loadingSemester } = useQuery<Items[]>({
        queryKey: ["semesters"],
        queryFn: fetchSemesters,
    });
    const semesters = semesterResult ?? [];

    const { data: levelResult, refetch: refetchLevels, isLoading: loadingLevel } = useQuery<Items[]>({
        queryKey: ["levels"],
        queryFn: fetchLevels,
    });
    const levels = levelResult ?? [];

    const { data: courseResult, refetch: refetchCourse, isLoading: loadingCourseTypes } = useQuery<Items[]>({
        queryKey: ["courseslist"],
        queryFn: fetchCoursesMainList,
    });
    const courses = courseResult ?? [];

    useEffect(() => {
        if (isOpenProgramCourseModal) {
            
            // Manually refetch the non-dependent queries
            refetchBulletins();
            refetchSchools();
            refetchSemesters();
            refetchLevels();
            refetchCourse();
        }
    }, [isOpenProgramCourseModal]);
    
  return (
    <>
        <Dialog open={isOpenProgramCourseModal} onOpenChange={onClose}>
            {isEditModalOpen === false && (
                <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-blue-400 text-white">
                    <Link className="h-4 w-4" />
                    { btnName }
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="md:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <div className="flex items-center justify-center gap-2">
                    <Link className="h-5 w-5 " />
                    <DialogTitle className="">Link Course to Program</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Fill in the form below to link course to program.
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
                        {showSpecCombo && <><Label htmlFor="course">Select Course</Label>
                        <ComboboxMain data={courses} onSelect={setSelectedCourse} initialValue={selectedCourse} /></>}
                        
                    </div>
                    
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
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleSaveCourse}>Link Course to Program</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default CourseProgramModal