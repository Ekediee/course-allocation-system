'use client'
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from 'next/link';

import { Semester, Program, Course, Level } from "@/data/constants";
// import { allocation_data } from "@/data/course_data";
import { useAppContext } from '@/contexts/ContextProvider'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AllocateLecturerModal from "@/components/AllocateLecturerModal";
import PrintLink from "./PrintLink";


const AllocationPage = ({allocationPage}: any) => {
    const {setPageHeader, 
        setPageHeaderPeriod, 
        setSelectedCourse, 
        allocateCourse, 
        isLevelFullyAllocated,
        fetchSemesterDataDE,
        fetchSemesterData
    } = useAppContext()
    const [activeSemester, setActiveSemester] = useState<string>("first");
    const [activeProgramMap, setActiveProgramMap] = useState<Record<string, string>>({});


    // Use a single query result based on allocationPage
    const queryResult = allocationPage === "Course Allocation"
        ? useQuery<Semester[]>({
            queryKey: ['semesters'],
            queryFn: fetchSemesterData
        })
        : useQuery<Semester[]>({
            queryKey: ['semesters'],
            queryFn: fetchSemesterDataDE
        });

    const { data: semesters, isLoading, error } = queryResult;
    
    const semesterdata: Semester | undefined = semesters?.find(
        (sem: Semester) => sem.id === activeSemester
    );

    // Set default active program for each semester when data is loaded
    useEffect(() => {
        if (semesters) {
            const defaultProgramMap: Record<string, string> = {};
            semesters.forEach((semester: Semester) => {
            if (semester.programs.length > 0) {
                defaultProgramMap[semester.id] = semester.programs[0].id;
            }
            });
            setActiveProgramMap(defaultProgramMap);
        }

        setPageHeader(allocationPage)
        setPageHeaderPeriod("First 24/25.3");
    }, [semesters]);

    const handleSemesterChange = (semesterId: string) => {
        setActiveSemester(semesterId);
        let sem = semesterId.toUpperCase() + " Semester";
        setPageHeaderPeriod(sem)
    };

    const handleProgramChange = (semesterId: string, programId: string) => {
        setActiveProgramMap(prev => ({
            ...prev,
            [semesterId]: programId
        }));
    };

    const handleSubmit = () => {
        console.log("Submitting semester allocation...");
    };

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
        <Tabs defaultValue={activeSemester} onValueChange={handleSemesterChange} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-100">
                {semesters?.map((semester: Semester) => (
                <TabsTrigger key={semester.id} value={semester.id} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6">
                    {semester.name}
                </TabsTrigger>
                ))}
            </TabsList>

            {/* Semester Content */}
            <div className="p-4">
            {semesters?.map((semester:any) => (
                <TabsContent key={semester.id} value={semester.id} className="space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>{semester.name}</CardTitle>
                    <CardDescription>
                        Manage course allocations for all programs in {semester.name}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {/* No programs message */}
                    {semester.programs?.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                        No programs available for this semester
                        </div>
                    ) : (
                        /* Second layer: Program Tabs */
                        <Tabs 
                            defaultValue={activeProgramMap[semester.id] || semester.programs[0]?.id} 
                            onValueChange={(value) => handleProgramChange(semester.id, value)}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-2 md:flex md:justify-start h-20 md:h-10 gap-2 mb-3 md:mb-4">
                                {semester.programs.map((program: Program) => (
                                <TabsTrigger key={program.id} value={program.id} className="bg-white md:w-56 md:h-8 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
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
                                <Tabs defaultValue={program.levels[0]?.id} className="w-full">
                                <div className="md:flex justify-between bg-gray-100 md:h-10">
                                <TabsList className="grid grid-cols-4 md:flex md:justify-start md:h-10 md:grid-cols-4 gap-2 mb-2">
                                    {program.levels.map((level: Level) => {
                                        const isAllocated = isLevelFullyAllocated(
                                            semester.id,
                                            program.id,
                                            level.id,
                                            semesters
                                        );
                                        console.log("isAllocated", isAllocated)
                                        return(
                                            <TabsTrigger key={level.id} value={level.id} className="bg-gray-100 md:h-8 data-[state=active]:bg-white">
                                                {level.name}
                                                {isAllocated && (
                                                    <CheckCircle className="ml-2 w-4 h-4 text-green-500" />
                                                )}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                                {allocateCourse === null ? "" : (<p>{allocateCourse?.code} - {allocateCourse?.title} {allocateCourse?.unit} - {allocateCourse?.allocatedTo}</p>)}
                                <div className="flex justify-between space-x-2 mb-4">
                                    {semesterdata && (
                                        <PrintLink semester={semester} />
                                    )}
                                    {semesterdata && <AllocateLecturerModal semester={semester} onSubmit={handleSubmit} />}
                                </div>
                                </div>
    
                                {/* Level Content - Course Table */}
                                {program.levels.map((level: Level) => (
                                    <TabsContent key={level.id} value={level.id}>
                                    {level.courses.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                        No courses available for this level
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                        <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead>SN</TableHead>
                                            <TableHead>Course Code</TableHead>
                                            <TableHead>Course Title</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead className="text-center">Allocated To</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {level.courses.map((course: Course) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-medium">{course.id}</TableCell>
                                                <TableCell >{course.code}</TableCell>
                                                <TableCell>{course.title}</TableCell>
                                                <TableCell>{course.unit}</TableCell>
                                                <TableCell className="text-center">{course.allocatedTo || "-"}</TableCell>
                                                <TableCell className="text-center">
                                                {course.isAllocated ? (
                                                    <Badge variant="outline" className="text-green-500">
                                                        Allocated
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" >
                                                        <Link 
                                                            href={{
                                                                pathname:"/course-allocation/allocate"
                                                            }} 
                                                            className="text-blue-500 hover:text-blue-700"
                                                            onClick={() => setSelectedCourse({
                                                                courseId: course.id,
                                                                courseCode: course.code,
                                                                courseTitle: course.title,
                                                                semesterId: semester.id,
                                                                programId: program.id,
                                                                programName: program.name,
                                                                levelId: level.id
                                                            })}
                                                        >
                                                            Allocate Lecturer
                                                        </Link>
                                                    </Badge>
                                                )}
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                        </Table>
                                        </div>
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
        </Tabs>
    </>
  )
}

export default AllocationPage