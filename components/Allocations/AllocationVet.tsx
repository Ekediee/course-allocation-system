'use client'
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Loader2, SquarePen } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

import { Semester, Program, Course, Level } from "@/data/constants";
// import { allocation_data } from "@/data/course_data";
import { useAppContext } from '@/contexts/ContextProvider'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AllocateLecturerModal from "@/components/Allocations/SubmitAllocationModal";
import PrintLink from "../PrintLink";

type AllocationStatus = {
    is_submitted: boolean;
}


const AllocationVet = ({allocationPage, url}: any) => {
    const {setPageHeader, 
        setPageHeaderPeriod, 
        setSelectedCourse, 
        allocateCourse, 
        isLevelFullyAllocated,
        vetDepIDs,
        fetchDepAllocations,
    } = useAppContext()
    const [activeSemester, setActiveSemester] = useState<string>('');
    const [activeProgramMap, setActiveProgramMap] = useState<Record<string, string>>({});

    // check allocation submission status
    // const { data: allocationStatus } = useQuery<AllocationStatus>({
    //     queryKey: ['allocation_status', activeSemester],
    //     queryFn: () => fetchAllocationStatus(activeSemester),
    //     enabled: !!activeSemester,
    // });
    
    // Use a single query result based on allocationPage
    const { data: semesters, isLoading, error } = useQuery<Semester[]>({
        queryKey: ['depcourses'], 
        queryFn: () => fetchDepAllocations(vetDepIDs?.department_id, vetDepIDs?.semester_id),
    });
    
    // const semesterdata: Semester | undefined = semesters?.find(
    //     (sem: Semester) => sem.id === semesters[0].id
    // );
    
    // Set default active program for each semester when data is loaded
    useEffect(() => {
        if (semesters && semesters.length > 0) {
            const defaultSemesterId = semesters[0].id;
            setActiveSemester(defaultSemesterId); // Initialize active semester

            const defaultProgramMap: Record<string, string> = {};
            semesters.forEach((semester: Semester) => {
                if (semester.programs.length > 0) {
                    defaultProgramMap[semester.id] = semester.programs[0].id;
                }
            });
            setActiveProgramMap(defaultProgramMap);
        }

        setPageHeader(allocationPage)
        // setPageHeaderPeriod("First 24/25.3");
    }, [semesters, allocationPage, setPageHeader]);

    const handleSemesterChange = (semesterId: string) => {
        setActiveSemester(semesterId);
    };
    
    const handleProgramChange = (semesterId: string, programId: string) => {
        setActiveProgramMap(prev => ({
            ...prev,
            [semesterId]: programId
        }));
    };

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        // console.log("Submitting semester allocation... ", activeSemester);

        const submi_allocation_data = {
            semester_id: activeSemester,
        };

        try {
            const res = await fetch('/api/allocation/submit', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(submi_allocation_data),
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
                
                toast({
                    variant: "success",
                    title: "Allocation Submitted Successfully",
                    description: data.message,
                });
                await queryClient.invalidateQueries({ queryKey: ['allocation_status', activeSemester] });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Allocation Submission Failed",
            description: (err as Error).message,
            });
        }
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
        <Tabs defaultValue={semesters && semesters.length > 0 ? semesters[0].id : ""} onValueChange={handleSemesterChange} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-20">
                {semesters?.map((semester: Semester) => (
                <TabsTrigger key={semester.id} value={semester.id} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
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
                        <div className="bg-gradient-to-r from-amber-200 to-amber-50 rounded-2xl p-4 md:p-6 mb-6">
                            <div className="flex justify-between items-center">
                                
                                <h2 className="text-xl font-medium mb-5">
                                    {semester.department_name} Department
                                </h2>
                    
                                <div className="flex justify-end items-center gap-4">
                                <Link 
                                    href={{
                                        pathname:"/vetter/course-allocations"
                                    }} 
                                >
                                    <Button variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft size={16} />
                                    Go back to list
                                    </Button>
                                </Link>
                    
                                <Button 
                                    size="sm" 
                                    className="bg-blue-700 hover:bg-blue-800"
                                    onClick={() => {}}
                                >
                                    Mark as Vetted
                                </Button>
                                </div>
                            </div>
                        </div>
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
                                    {level.courses.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                        No courses available for this level
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                        <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead>Course Code</TableHead>
                                            <TableHead>Course Title</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead className="text-center">Lecturer</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {level.courses.map((course: Course) => (
                                            <TableRow key={course.id}>
                                                <TableCell >{course.code}</TableCell>
                                                <TableCell>{course.title}</TableCell>
                                                <TableCell>{course.unit}</TableCell>
                                                <TableCell className="text-center">{course.allocatedTo || "-"}</TableCell>
                                                
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

export default AllocationVet