"use client"
import CourseMainModal from '@/components/ResourceUpload/course/CourseMainModal';
import DeleteConfirmationModal from '@/components/ResourceUpload/department/DeleteConfirmationModal';
import SearchTable from '@/components/SearchTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppContext } from '@/contexts/ContextProvider';
import { useToast } from '@/hooks/use-toast';
import { useTable } from '@/lib/useTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownWideNarrow, SquarePen } from 'lucide-react';
import React from 'react'

const ManageCourses = () => {

    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    const {
        fetchCoursesMain,
        role
    } = useAppContext()

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: courseResult, isLoading, error } = useQuery<{ courses: any[] }>({
        queryKey: ['courses'],
        queryFn: fetchCoursesMain
    })

    const courseData = courseResult?.courses;

    const { paginated: paginatedCourses, totalPages } = useTable({
        data: courseData ?? [],
        searchTerm,
        searchKeys: ['code', 'title', 'unit', 'course_type',],
        sortColumn,
        sortDirection: sortDirection as 'asc' | 'desc',
        currentPage,
        itemsPerPage,
    });

    const canEdit = role === 'admin' || role === 'vetter';

    const handleEdit = (course: any) => {
        
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    const handleDelete = (course: any) => {
        setSelectedCourse(course);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedCourse) {
            try {
                const res = await fetch(`/api/manage-uploads/course/main?id=${selectedCourse.id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    toast({
                        variant: "success",
                        title: "Course Deleted",
                        description: `Course ("${selectedCourse.code} - ${selectedCourse.title}") has been deleted successfully.`
                    });
                    queryClient.invalidateQueries({ queryKey: ['courses'] });
                } else {
                    const data = await res.json();
                    toast({
                        variant: "destructive",
                        title: "Delete Failed",
                        description: data.error || "An unknown error occurred."
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Delete Failed",
                    description: (error as Error).message
                });
            }
            setIsDeleteModalOpen(false);
        }
    };

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


  return (
    <>
        <Card className="m-4">
            <CardHeader className="text-2xl font-bold">
                Course Management
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <SearchTable setSearchTerm={setSearchTerm} />
                    <Table className='mt-2'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => { setSortColumn('code'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Course Code
                                    </div>
                                </TableHead>
                                <TableHead className='cursor-pointer' onClick={() => { setSortColumn('title'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Course Title
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => { setSortColumn('unit'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Unit
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => { setSortColumn('course_type'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Course Type
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCourses.map((course:any, index) => (
                                <TableRow key={index}>
                                    <TableCell >{course.code}</TableCell>
                                    <TableCell >{course.title}</TableCell>
                                    <TableCell >
                                        {course.unit}
                                    </TableCell>
                                    <TableCell >
                                        {course.course_type.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button disabled={!canEdit} variant="outline" size="sm" onClick={() => handleEdit(course)}>
                                            <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
                                            Edit
                                        </Button>
                                        <Button disabled={!canEdit} variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(course)}>Delete</Button>
                                    </TableCell>
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
            </CardContent>
        </Card>
        {isEditModalOpen && (
            <CourseMainModal
                btnName="Edit Course"
                course={selectedCourse}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onAddCourse={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}
            />
        )}

        {isDeleteModalOpen && (
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete the course "(${selectedCourse?.code} - ${selectedCourse?.title})"?`}
            />
        )}
    </>
  )
}

export default ManageCourses