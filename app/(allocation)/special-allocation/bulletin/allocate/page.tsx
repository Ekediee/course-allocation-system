"use client";
import BulletinProgram from '@/components/BulletinProgram'
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

import { useAppContext } from '@/contexts/ContextProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Course = {
    id: string;
    code: string;
    title: string;
    unit: number;
    isAllocated: boolean;
    allocatedTo?: string;
};

type Level = {
    id: string;
    name: string;
    courses: Course[];
};

type Program = {
    id: string;
    name: string;
    levels: Level[];
};

const Allocate = () => {
    const { 
        fetchProgramSA,
        setSelectedCourse
    } = useAppContext()

    
    const view = true; // Changes the width of the bulletin program component
    // 'https://mocki.io/v1/59bc9992-2ce7-4794-8db1-57a525897cbc'

    const { data: programs, isLoading, error } = useQuery<Program[]>({
        queryKey: ['programs'], // Add bulletin to the key
        queryFn: fetchProgramSA, // Wrap call in function
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !programs || programs.length === 0) {
        return <div>No programs found.</div>;
    }

  return (
    <>
        <BulletinProgram step={0} view={view} />

        <Card className="m-4">
            <CardContent className="p-2">
                <Tabs defaultValue={programs[0]?.levels[0]?.id} className="w-full">
                    <div className="md:flex justify-between bg-gray-100 md:h-10">
                        <TabsList className="grid grid-cols-4 md:flex md:justify-start md:h-10 md:grid-cols-4 gap-2 mb-2">
                            {programs[0].levels.map((level: Level) => (
                                <TabsTrigger key={level.id} value={level.id} className="bg-gray-100 md:h-8 data-[state=active]:bg-white">
                                    {level.name}
                                </TabsTrigger>
                                
                            ))}
                        </TabsList>
                    </div>
                    {programs[0].levels.map((level: Level) => (
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
                                                    // semesterId: semester.id,
                                                    programId: programs[0].id,
                                                    programName: programs[0].name,
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
            </CardContent>
        </Card>
    </>
  )
}

export default Allocate