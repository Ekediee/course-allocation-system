import React from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, Loader2 } from 'lucide-react';
import EmptyPage from './EmptyPage';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CourseModal from './CourseModal';

const CourseContent = () => {
    const {
        fetchCourses,
        isUploading,
    } = useAppContext()

    const queryClient = useQueryClient();

    const { data: courseResult, isLoading, error } = useQuery<{ courses: any[] }>({
        queryKey: ['courses'],
        queryFn: fetchCourses
    })

    const courseData = courseResult?.courses;

    

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-10 w-[150px]" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-[120px]" />
                        <Skeleton className="h-10 w-[120px]" />
                    </div>
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isUploading) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Uploading...
            </div>
        )
    }
  return (
    <>
        <TabsContent value="course">
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Courses
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <CourseModal btnName="Add Course" onAddCourse={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}/>
                        </div>
                    </div>
                    {courseData && courseData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Title</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Specialization</TableHead>
                                <TableHead className="text-center">Bulletin</TableHead>
                                <TableHead className="text-center">Level</TableHead>
                                <TableHead className="text-center">Unit</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {courseData.map((course:any) => (
                                <TableRow key={course.id}>
                                    <TableCell >{course.code}</TableCell>
                                    <TableCell >{course.title}</TableCell>
                                    <TableCell >
                                        {course.program?.name}
                                    </TableCell>
                                    <TableCell >
                                        {course.specialization?.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.bulletin?.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.level?.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.unit}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No Courses Available" 
                            desc="Create a new course to see details" 
                            btnName="Add Course" 
                            onAddCourse={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default CourseContent