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
import { Button } from "@/components/ui/button"

const CourseContent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(13);

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

    const filteredCourses = courseData?.filter((course: any) =>
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.program?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.specialization?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.bulletin?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCourses = filteredCourses?.sort((a: any, b: any) => {
        if (sortColumn) {
            const aValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj?.[key], a) : a[sortColumn];
            const bValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj?.[key], b) : b[sortColumn];

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const totalPages = Math.ceil((sortedCourses?.length || 0) / itemsPerPage);
    const paginatedCourses = sortedCourses?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    

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
            <Card className="m-4">
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            <input type="text" placeholder="Search..." className="border-0 focus:ring-0" onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <CourseModal btnName="Add Course" onAddCourse={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}/>
                        </div>
                    </div>
                    {paginatedCourses && paginatedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead onClick={() => { setSortColumn('code'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Course Code</TableHead>
                                <TableHead onClick={() => { setSortColumn('title'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Course Title</TableHead>
                                <TableHead onClick={() => { setSortColumn('program.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Program</TableHead>
                                <TableHead onClick={() => { setSortColumn('specialization.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Specialization</TableHead>
                                <TableHead className="text-center" onClick={() => { setSortColumn('bulletin.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Bulletin</TableHead>
                                <TableHead className="text-center" onClick={() => { setSortColumn('level.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Level</TableHead>
                                <TableHead className="text-center" onClick={() => { setSortColumn('unit'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Unit</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {paginatedCourses.map((course:any) => (
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
                            <div className="flex justify-end items-center gap-2 mt-4">
                                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                            </div>
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