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
import { Bulletin } from "@/components/ResourceUpload/course/CourseVet";
import { Semester, Program, Course, Level } from "@/data/constants";
// import { allocation_data } from "@/data/course_data";
import { useAppContext } from '@/contexts/ContextProvider'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AllocateLecturerModal from "@/components/Allocations/SubmitAllocationModal";
import PrintLink from "../PrintLink";
import { useRouter } from "next/navigation"
import { ComboboxMain, Items } from "@/components/ComboboxMain";
import type { Semester as SemesterT } from '@/data/constants';

type AllocationStatus = {
    is_submitted: boolean;
}


const AllocationVet = ({allocationPage, url}: any) => {
    const {setPageHeader, 
        setPageHeaderPeriod,
        setPrevPath, 
        role, 
        allocateCourse, 
        isLevelFullyAllocated,
        vetDepIDs,
        fetchBulletinName,
        fetchDepAllocations,
    } = useAppContext()
    const [activeSemester, setActiveSemester] = useState<string>('');
    const [activeProgramMap, setActiveProgramMap] = useState<Record<string, string>>({});
    const [activeLevelMap, setActiveLevelMap] = useState<Record<string, string>>({});
    const [selectedBulletin, setSelectedBulletin] = useState('');
    const [activeSpecializationMap, setActiveSpecializationMap] = useState<Record<string, string>>({});

    const router = useRouter();

    const { data: bulletins = [], isLoading: loadingBulletins } = useQuery<Items[]>({
        queryKey: ["bulletins"],
        queryFn: fetchBulletinName,
    });
    
    // Use a single query result based on allocationPage
    const { data: semesters, isLoading, error } = useQuery<Bulletin[]>({
        queryKey: ['depcourses'], 
        queryFn: () => fetchDepAllocations(vetDepIDs?.department_id, vetDepIDs?.semester_id),
    });
    
    // Set default active program for each semester when data is loaded
    useEffect(() => {
        if (semesters && semesters?.length > 0) {
            const defaultSemesterId = semesters?.[0]?.id;
            setActiveSemester(defaultSemesterId); // Initialize active semester

            const defaultProgramMap: Record<string, string> = {};
            semesters.forEach((b: Bulletin) => {
                const firstSem = b.semester?.[0];

                if (firstSem) {
                    if (firstSem.programs?.length > 0) {
                        defaultProgramMap[firstSem.id] = firstSem?.programs?.[0]?.id;
                    }
                }
                
            });
            setActiveProgramMap(defaultProgramMap);
        }

        setPageHeader(allocationPage)
        setSelectedBulletin(bulletins?.[1]?.id ?? "");
        // setPageHeaderPeriod("First 24/25.3");
    }, [semesters, allocationPage, setPageHeader]);

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

    // const courses = useMemo<Semester[]>(() => {
    //     if (!Array.isArray(semesters)) return [];
    //     const found = semesters.find(item => item.id === selectedBulletin);
    //     return found?.semester ?? [];
    // }, [selectedBulletin, semesters]);

    // const courses = useMemo<SemesterT[]>(() => {
    //     if (!Array.isArray(semesters)) return [];
    //     // narrow semesters elements so TS knows each bulletin contains a Semester[] matching the shared type
    //     const found = (semesters as Array<{ id: string; semester?: SemesterT[] }>).find(
    //         item => item.id === selectedBulletin
    //     );
    //     return found?.semester ?? [];
    // }, [selectedBulletin, semesters]);

    const courses = useMemo<SemesterT[]>(() => {
        if (!Array.isArray(semesters)) {
            return [];
        }
        // Find the bulletin in the `semesters` (which is actually a list of bulletins)
        const foundBulletin = semesters.find(bulletin => bulletin.id === selectedBulletin);
        
        // Return the semester array from the found bulletin, or an empty array.
        return foundBulletin?.semester ?? [];
    }, [selectedBulletin, semesters]);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleVetAllocation = async (semester_id: string, department_id: string) => {
        
        const vet_allocation_data = {
            semester_id: semester_id,
            department_id: department_id
        };

        try {
            const res = await fetch('/api/allocation/vet', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(vet_allocation_data),
            });

            if (res.status.toString().startsWith("40")) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: data.title,
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                const data = await res.json();
                
                toast({
                    variant: "success",
                    title: "Allocation vetted Successfully",
                    description: data.message,
                });
                await queryClient.invalidateQueries({ queryKey: ['vetting_status', activeSemester, department_id] });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Allocation Submission Failed",
            description: (err as Error).message,
            });
        }

        router.push('/vetter/course-allocations');
    };

    const handleUnblockAllocation = async (semester_id: string, department_id: string) => {
        
        const unblock_allocation_data = {
            semester_id: semester_id,
            department_id: department_id
        };

        try {
            const res = await fetch('/api/allocation/unblock', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(unblock_allocation_data),
            });

            if (res.status.toString().startsWith("40")) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: data.title,
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                const data = await res.json();
                
                toast({
                    variant: "success",
                    title: "Allocation unblocked Successfully",
                    description: data.message,
                });
                await queryClient.invalidateQueries({ queryKey: ['unblock_status', activeSemester, department_id] });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Allocation Unblocking Failed",
            description: (err as Error).message,
            });
        }

        router.push('/vetter/course-allocations');
    };

    const handlePrintAllocation = async (semester_id: string, department_id: string) => {
        
        setPrevPath("/vetter/course-allocations/vet-allocation")

        const url = `/course-allocation/reports?semester=${semester_id}&department=${department_id}`;
  
        // Pass the complete string to router.push
        router.push(url);
    };

    const handlePushToUmis = async (program_course_id: string) => {
        
        const push_to_umis_data = {
            program_course_id: program_course_id
        };

        try {
            const res = await fetch('/api/allocation/push_to_umis', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(push_to_umis_data),
            });

            if (res.status.toString().startsWith("40") || res.status === 207) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: data.title || "Pushing Allocation to UMIS Failed",
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                const data = await res.json();
                
                toast({
                    variant: "success",
                    title: "Allocation Successfully pushed to UMIS",
                    description: data.message,
                });
                
                // Invalidate the query that fetches all the page data.
                await queryClient.invalidateQueries({ queryKey: ['depcourses'] });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Allocation Submission to UMIS Failed",
            description: (err as Error).message,
            });
        }

    };

    const calculateUniqueTotalUnits = (courses: Course[]): number => {
        if (!Array.isArray(courses)) {
            return 0;
        }

        // Use a Map to store unique courses based on their ID.
        // This is more efficient than using .filter() + .findIndex() on large arrays.
        const uniqueCourses = new Map<string, Course>();
        courses.forEach(course => {
            // Use course.id as the key. If you don't have a unique ID, course.code is a good fallback.
            uniqueCourses.set(course.code, course);
        });

        // Convert the Map values back to an array and then calculate the sum.
        const uniqueCoursesArray = Array.from(uniqueCourses.values());
        
        return uniqueCoursesArray.reduce((total, course) => total + (course.unit ?? 0), 0);
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
        <Tabs value={activeSemester} onValueChange={handleSemesterChange} className="w-full">
            <TabsList className="w-full justify-between pr-[65px] rounded-none border-b h-10 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[57px] z-20">
                {courses?.map((semester: Semester) => (
                <TabsTrigger key={semester.id} value={semester.id} className="rounded-none h-10 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
                    {semester.name}
                </TabsTrigger>
                ))}

                <div className='w-[250px] '>
                    <div className="flex items-center gap-4">
                        <span className="font-bold">Bulletin:</span>
                        <ComboboxMain data={bulletins} onSelect={setSelectedBulletin} initialValue={selectedBulletin} />
                    </div>
                </div>
            </TabsList>

            {/* Semester Content */}
            {courses.length === 0 ? (
                <div className="flex justify-center items-center p-4 text-center text-muted-foreground ">
                    No data available for this bulletin
                </div>
            ) : (
            <div className="p-4">
            {courses?.map((semester:any, index) => (
                <TabsContent key={index} value={semester.id} className="space-y-6">
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
                                {(semester.submitted && role === 'superadmin') && (
                                    <Button 
                                        size="sm" 
                                        className="bg-blue-700 hover:bg-blue-800"
                                        onClick={() => handleUnblockAllocation(semester.id, semester.department_id)}
                                    >
                                        Unblock Allocation
                                    </Button>
                                )}
                                
                                {!semester.vetted && (
                                    <Button 
                                        size="sm" 
                                        className="bg-blue-700 hover:bg-blue-800"
                                        onClick={() => handleVetAllocation(semester.id, semester.department_id)}
                                    >
                                        Mark as Vetted
                                    </Button>
                                )}

                                {semester.vetted && (
                                    <Button 
                                        variant='outline'
                                        size="sm" 
                                        className=""
                                        onClick={() => handlePrintAllocation(semester.id, semester.department_id)}
                                    >
                                        Print
                                    </Button>
                                )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                    {/* No programs message */}
                    {semester?.programs?.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                        No programs available for this semester
                        </div>
                    ) : (
                        /* Second layer: Program Tabs */
                        <Tabs 
                            defaultValue={activeProgramMap[semester.id] || semester?.programs[0]?.id} 
                            onValueChange={(value) => handleProgramChange(semester.id, value)}
                            className="w-full"
                        >
                            <TabsList className="grid grid-cols-2 md:flex md:justify-start h-20 md:h-10 gap-2 mb-3 md:mb-4">
                                {semester?.programs.map((program: Program, index:any) => (
                                <TabsTrigger key={index} value={program.id} className="bg-white md:w-[274px] md:h-8 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                                    {program.name}
                                </TabsTrigger>
                                ))}
                            </TabsList>
    
                        {/* Program Content */}
                        {semester?.programs.map((program: Program) => (
                            <TabsContent key={program.id} value={program.id} className="space-y-4">
                            {/* No levels message */}
                            {program?.levels?.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                No levels available for this program
                                </div>
                            ) : (
                                /* Third layer: Level Tabs */
                                <Tabs defaultValue={program?.levels[0]?.id} className="w-full">
                                <div className="md:flex justify-between bg-gray-100 md:h-10">
                                <TabsList className="grid grid-cols-4 md:flex md:justify-start md:h-10 md:grid-cols-4 gap-2 mb-2">
                                    {program?.levels.map((level: Level) => {
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
                                    {level?.courses?.length === 0 ? (
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
                                            <TableHead>Class Option</TableHead>
                                            <TableHead className="text-center">Lecturer</TableHead>
                                            {semester.vetted && (
                                                <>
                                                    <TableHead className="text-center">Action</TableHead>
                                                    <TableHead className="text-center">Pushed to UMIS by</TableHead>
                                                </>
                                            )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {level?.courses?.map((course: Course, index) => (
                                            <TableRow key={index}>
                                                <TableCell >{course.code}</TableCell>
                                                <TableCell>{course.title}</TableCell>
                                                <TableCell>{course.unit}</TableCell>
                                                <TableCell>{course.class_option}</TableCell>
                                                <TableCell className="text-center">{course.allocatedTo || "-"}</TableCell>
                                                {semester.vetted && (
                                                    <>
                                                        <TableCell className="text-center">
                                                            <Button 
                                                                size="sm" 
                                                                className="bg-blue-700 hover:bg-blue-800"
                                                                onClick={() => handlePushToUmis(course.id)}
                                                                disabled={course.is_pushed_to_umis}
                                                            >
                                                                {course.is_pushed_to_umis ? "On UMIS": "Push to UMIS"}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className="text-center">{course.pushed_to_umis_by}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-400">
                                                <TableCell className=" font-bold"></TableCell>
                                                <TableCell colSpan={1} className=" font-bold">Total</TableCell>
                                                <TableCell colSpan={5} className="font-bold">
                                                    {/* {(level?.courses ?? []).reduce((total, course) => total + (course.unit ?? 0), 0)} */}
                                                    {calculateUniqueTotalUnits(level?.courses ?? [])}
                                                </TableCell>
                                            </TableRow>
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
            )}
        </Tabs>
    </>
  )
}

export default AllocationVet