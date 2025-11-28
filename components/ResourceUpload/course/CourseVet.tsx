'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Loader2, SquarePen } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

// import { Semester, Program, Course } from "@/data/constants";
import { useAppContext } from '@/contexts/ContextProvider'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ComboboxMain, Items } from "@/components/ComboboxMain";
// import PrintLink from "../PrintLink";

type AllocationStatus = {
    is_submitted: boolean;
}

export interface Bulletin {
  id: string;
  name: string;
  semester: Semester[];
}

interface Specialization {
  id: string | 'general'; // ID can be a number (as string) or the special 'general' string
  name: string;
  courses: Course[];
}
  
interface Level {
  id: string;
  name: string;
  specializations: Specialization[];
}

// Types for our data
interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  isAllocated: boolean;
  allocatedTo?: string;
  programCourseId?: string;
}

interface Program {
  id: string;
  name: string;
  levels: Level[];
}

interface Semester {
  sessionId: string;
  sessionName: string;
  id: string;
  name: string;
  programs: Program[];
}

interface Lecturer {
  id: number;
  staff_id: string;
  name: string;
  rank: string;
  qualification: string;
  phone: string;
}

const CoursesVet = ({allocationPage, url}: any) => {
    const {setPageHeader, 
        allocateCourse, 
        isLevelFullyAllocated,
        viewDepIDs,
        fetchBulletinName,
        fetchDepCourses,
    } = useAppContext()

    // If viewDepIDs is missing, we cannot fetch courses. Stop here.
    const isContextMissing = !viewDepIDs?.department_id;
    
    const [activeSemester, setActiveSemester] = useState<string>('');
    const [activeProgramMap, setActiveProgramMap] = useState<Record<string, string>>({});
    const [activeLevelMap, setActiveLevelMap] = useState<Record<string, string>>({});
    const [selectedBulletin, setSelectedBulletin] = useState('');
    const [activeSpecializationMap, setActiveSpecializationMap] = useState<Record<string, string>>({});

    const { data: bulletins = [], isLoading: loadingBulletins } = useQuery<Items[]>({
        queryKey: ["bulletins"],
        queryFn: fetchBulletinName,
    });
    
    // Use a single query result based on allocationPage
    const { data: semesters, isLoading, error } = useQuery<Bulletin[]>({
        queryKey: ['depcourses'], 
        queryFn: () => fetchDepCourses(viewDepIDs?.department_id, viewDepIDs?.semester_id),
    });
    
    // Set default active program for each semester when data is loaded
    useEffect(() => {
        if (semesters && semesters.length > 0) {
            const defaultSemesterId = semesters[0]?.semester?.[0]?.id;
            setActiveSemester(defaultSemesterId); // Initialize active semester

            const defaultProgramMap: Record<string, string> = {};
            const defaultLevelMap: Record<string, string> = {};
            const defaultSpecializationMap: Record<string, string> = {};

            semesters.forEach((b: Bulletin) => {
                 const firstSem = b.semester?.[0];

                if (firstSem) {
                    // Set default program for the semester
                    if (firstSem.programs.length > 0) {
                        defaultProgramMap[firstSem.id] = firstSem?.programs?.[0].id;
                    }
                    // Loop through EACH program to set its default level
                    firstSem.programs.forEach((program: Program) => {
                        if (program.levels.length > 0) {
                            defaultLevelMap[program.id] = program?.levels?.[0]?.id;

                            // Drill down to set the default specialization
                            const firstLevel = program?.levels?.[0];
                            if (firstLevel?.specializations.length > 0) {
                                defaultSpecializationMap[firstLevel.id] = firstLevel?.specializations?.[0]?.id;
                            }
                        }
                    });
                }
            });
            setActiveProgramMap(defaultProgramMap);
            setActiveLevelMap(defaultLevelMap);
            setActiveSpecializationMap(defaultSpecializationMap);
        }

        // setPageHeader(allocationPage)
        
        setSelectedBulletin(bulletins?.[1]?.id ?? "");
    }, [semesters, bulletins, allocationPage, setPageHeader]);

    // This runs when selectedBulletin or semesters changes
    useEffect(() => {
        // Don't run if we don't have the necessary data yet
        if (!selectedBulletin || !Array.isArray(semesters)) {
            return;
        }

        // Find the data for the currently selected bulletin
        const currentBulletinData = semesters?.find(item => item.id === selectedBulletin);
        if (!currentBulletinData) return;

        // Find the first semester in that bulletin's data
        const firstSemester = currentBulletinData?.semester?.[0];
        if (!firstSemester) return;

        // Set the active semester to this first semester
        setActiveSemester(firstSemester?.id);

        // Find the first program in that semester
        const firstProgram = firstSemester?.programs?.[0];
        if (firstProgram) {
            // Update the active program map for this semester
            setActiveProgramMap(prev => ({
                ...prev,
                [firstSemester.id]: firstProgram.id
            }));

            // Find the first level in that program
            const firstLevel = firstProgram?.levels?.[0];
            if (firstLevel) {
                // Update the active level map for this program
                setActiveLevelMap(prev => ({
                    ...prev,
                    [firstProgram.id]: firstLevel.id
                }));

                // Drill down to set the default specialization
                const firstSpecialization = firstLevel?.specializations?.[0];
                if (firstSpecialization) {
                    setActiveSpecializationMap(prev => ({ // <-- ADD THIS BLOCK
                        ...prev,
                        [firstLevel.id]: firstSpecialization.id
                    }));
                }
            }
        }
    }, [selectedBulletin, semesters]);

    const handleSemesterChange = (semesterId: string) => {
        setActiveSemester(semesterId);
    };
    
    const handleProgramChange = (semesterId: string, programId: string) => {
        setActiveProgramMap(prev => ({
            ...prev,
            [semesterId]: programId
        }));
    };

    const handleLevelChange = (programId: string, levelId: string) => {
        setActiveLevelMap(prev => ({
            ...prev,
            [programId]: levelId
        }));
    };

    const handleSpecializationChange = (levelId: string, specializationId: string) => {
        setActiveSpecializationMap(prev => ({
            ...prev,
            [levelId]: specializationId,
        }));
    };

    const courses = useMemo<Semester[]>(() => {
        if (!Array.isArray(semesters)) return [];
        const found = semesters.find(item => item.id === selectedBulletin);
        return found?.semester ?? [];
    }, [selectedBulletin, semesters]);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-start mb-2 gap-4">
                    <Skeleton className="h-12 w-[200px] mb-1" />
                    <Skeleton className="h-12 w-[200px] mb-1" />
                    <Skeleton className="h-12 w-[200px] mb-1" />
                </div>
                <div className="flex items-center justify-start mb-2 gap-4">
                    <Skeleton className="h-10 w-[300px] mb-1" />
                    <Skeleton className="h-10 w-[300px] mb-1" />
                    <Skeleton className="h-10 w-[300px] mb-1" />
                </div>
                <div className="flex items-center justify-start mb-2 gap-4">
                    <Skeleton className="h-10 w-[100px] mb-6" />
                    <Skeleton className="h-10 w-[100px] mb-6" />
                    <Skeleton className="h-10 w-[100px] mb-6" />
                </div>
                <Card className="p-4 md:p-6 max-w-full">
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isContextMissing) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-lg text-gray-600">No department selected.</p>
                <Link href="/vetter/courses-by-department">
                    <Button>Go Back to Selection</Button>
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-3xl mx-auto mt-8">
            <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription>Failed to load course allocation data</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Please try again later or contact support.</p>
            </CardContent>
            </Card>
        );
    }

  return (
    <>
        {/* First layer: Semester Tabs */}
        <Tabs value={activeSemester} onValueChange={handleSemesterChange} className="w-full">
            <TabsList className="w-full justify-between rounded-none border-b h-10 p-0 pr-[65px] bg-white shadow-sm border-b border-gray-200 sticky top-[57px] z-20">
                {courses?.map((semester: Semester) => (
                <TabsTrigger key={semester.id} value={semester.id} className="rounded-none h-10 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
                    {semester.name}
                </TabsTrigger>
                ))}
                
                {/* <div className={` w-[250px] ${courses.length == 0 ? "ml-[778px]" : "ml-[640px]"} `}> */}
                <div className='w-[250px] '>
                    <div className="flex items-center gap-4">
                        <span className="font-bold">Bulletin:</span>
                        <ComboboxMain data={bulletins} onSelect={setSelectedBulletin} initialValue={selectedBulletin} />
                    </div>
                </div>
                {/* <div></div> */}
            </TabsList>

            {/* Semester Content */}
            {courses.length === 0 ? (
                <div className="flex justify-center items-center p-4 text-center text-muted-foreground ">
                    No data available for this bulletin
                </div>
            ) : (
            <div className="p-4">
            {courses?.map((semester:any) => (
                <TabsContent key={semester.id} value={semester.id} className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="bg-gradient-to-r from-amber-200 to-amber-50 rounded-2xl p-4 md:p-6 mb-6">
                            <div className="flex justify-between items-center">
                                
                                <h2 className="text-xl font-medium">
                                    {semester.department_name} Department
                                </h2>
                                
                                <div className="flex justify-end items-center gap-4">
                                <Link 
                                    href={{
                                        pathname:"/vetter/courses-by-department"
                                    }} 
                                >
                                    <Button variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft size={16} />
                                    Go back
                                    </Button>
                                </Link>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                    {/* No programs message */}
                    {semester.programs?.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No program data available for this semester
                        </div>
                    ) : (
                        /* Second layer: Program Tabs */
                        <Tabs 
                            value={activeProgramMap[semester.id] || semester.programs[0]?.id} 
                            onValueChange={(value) => handleProgramChange(semester.id, value)}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-2 md:flex md:justify-start h-20 md:h-10 gap-2 mb-3 md:mb-4">
                                {semester.programs.map((program: Program) => (
                                <TabsTrigger 
                                    key={program.id} 
                                    value={program.id}
                                    title={program.name} 
                                    className="bg-white md:w-[274px] md:h-8 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                                >
                                    {program.name}
                                </TabsTrigger>
                                ))}
                            </TabsList>
    
                        {/* Program Content */}
                        {semester.programs.map((program: Program) => (
                            <TabsContent key={program.id} value={program.id} className="space-y-4">
                            {/* No levels message */}
                            {program.levels.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                No levels available for this program
                                </div>
                            ) : (
                                /* Third layer: Level Tabs */
                                <Tabs 
                                    value={activeLevelMap[program.id] || program.levels[0]?.id} 
                                    className="w-full"
                                    onValueChange={(value) => handleLevelChange(program.id, value)}
                                >
                                <div className="md:flex justify-between bg-gray-100 md:h-10">
                                <TabsList className="grid grid-cols-4 md:flex md:justify-start md:h-10 md:grid-cols-4 gap-2 mb-2">
                                    {program.levels.map((level: Level) => (
                                            <TabsTrigger key={level.id} value={level.id} className="bg-gray-100 md:h-8 data-[state=active]:bg-white">
                                                {level.name}
                                            </TabsTrigger>
                                        )
                                    )}
                                </TabsList>
                                {allocateCourse === null ? "" : (<p>{allocateCourse?.code} - {allocateCourse?.title} {allocateCourse?.unit} - {allocateCourse?.allocatedTo}</p>)}
                                {/* <div className="flex justify-between space-x-2 mb-4">
                                    {semesterdata && (
                                        <PrintLink semester={semester} />
                                    )}
                                    {(semesterdata && !allocationStatus?.is_submitted) && <AllocateLecturerModal semester={semester} onSubmit={handleSubmit} />}
                                </div> */}
                                </div>
    
                                {/* Level Content - Course Table */}
                                {program.levels.map((level: Level) => (
                                    <TabsContent key={level.id} value={level.id}>
                                        {level.specializations.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground">
                                                No courses available for this level
                                            </div>
                                        ) : (
                                            <>
                                                {/* Fourth layer: Specialization Tabs */}
                                                <Tabs
                                                    value={activeSpecializationMap[level.id] || level.specializations[0]?.id}
                                                    onValueChange={(value) => handleSpecializationChange(level.id, value)}
                                                    className="w-full"
                                                >
                                                    <TabsList className="grid grid-cols-2 md:flex md:flex-wrap md:justify-start gap-2 mb-3 md:mb-4 h-auto">
                                                        {level.specializations.map((spec: Specialization) => (
                                                            <TabsTrigger
                                                                key={spec.id}
                                                                value={spec.id}
                                                                className="bg-white px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white h-auto"
                                                            >
                                                                {spec.name}
                                                            </TabsTrigger>
                                                        ))}
                                                    </TabsList>

                                                    {/* Specialization Content - The Final Course Table */}
                                                    {level.specializations.map((spec: Specialization) => (
                                                        <TabsContent key={spec.id} value={spec.id}>
                                                            <div className="overflow-x-auto border rounded-lg">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead className="w-1/5">Course Code</TableHead>
                                                                            <TableHead className="w-3/5">Course Title</TableHead>
                                                                            <TableHead className="w-1/5">Unit</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {spec.courses.map((course: Course) => (
                                                                            <TableRow key={course.id}>
                                                                                <TableCell>{course.code}</TableCell>
                                                                                <TableCell>{course.title}</TableCell>
                                                                                <TableCell>{course.unit}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                        {/* Total Row for this Specialization */}
                                                                        <TableRow className="bg-gray-400">
                                                                            <TableCell className=" font-bold"></TableCell>
                                                                            <TableCell colSpan={1} className=" font-bold">Total</TableCell>
                                                                            <TableCell colSpan={2} className="font-bold">
                                                                                {spec.courses.reduce((total, course) => total + course.unit, 0)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </TabsContent>
                                                    ))}
                                                </Tabs>
                                                
                                                {/* Grand Total Row for the Entire Level */}
                                                {/* <div className="mt-4 p-4 bg-slate-200 rounded-lg flex justify-end font-bold text-lg">
                                                    <span>Total Units for {level.name}: </span>
                                                    <span className="ml-4 w-20 text-left">
                                                        {level.specializations
                                                            .flatMap(spec => spec.courses)
                                                            .reduce((total, course) => total + course.unit, 0)}
                                                    </span>
                                                </div> */}
                                            </>
                                        )}
                                    </TabsContent>
                                ))}
                                </Tabs>
                            )}
                            </TabsContent>
                        ))}
                        </Tabs>
                    )}
                    </CardContent>
                </Card>
                </TabsContent>
            ))}
            </div>
            )}
        </Tabs>
    </>
  )
}

export default CoursesVet