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
import SearchTable from '@/components/SearchTable';
import { useToast } from '@/hooks/use-toast';
import DeleteConfirmationModal from '../department/DeleteConfirmationModal';
import { useTable } from '@/lib/useTable';
import { useRouter } from 'next/navigation';

const CourseContent = () => {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(13);
    const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const { toast } = useToast();

    const {
        fetchCourses,
        isUploading,
        role
    } = useAppContext()

    const queryClient = useQueryClient();
    const canEdit = role === 'admin' || role === 'superadmin' || role === 'vetter';

    const { data: courseResult, isLoading, error } = useQuery<{ courses: any[] }>({
        queryKey: ['courses'],
        queryFn: fetchCourses
    })

    const courseData = courseResult?.courses;

    const { paginated: paginatedCourses, totalPages } = useTable({
        data: courseData ?? [],
        searchTerm,
        searchKeys: ['code', 'title', 'unit', 'course_type', 'program.name', 'specialization.name', 'bulletin.name', 'level.name'],
        sortColumn,
        sortDirection: sortDirection as 'asc' | 'desc',
        currentPage,
        itemsPerPage,
    });

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
                const res = await fetch(`/api/manage-uploads/course?id=${selectedCourse.program_course_id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    toast({
                        variant: "success",
                        title: "Course Disconnected",
                        description: `Course "${selectedCourse.title}" has been disconnect from the program "${selectedCourse.program.name}".`
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

    const handleViewDepartment = () => {
    
        // setVetDepIDs({
        // department_id: department_id,
        // semester_id: semester_id
        // });

        router.push("/vetter/courses-by-department");
    }

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
                        <SearchTable setSearchTerm={setSearchTerm} />
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="text-webblue-100 hover:text-blue-700" onClick={() => handleViewDepartment()}>View by Department</Button>
                            <CourseModal btnName="Add Course" onAddCourse={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}/>
                        </div>
                    </div>
                    {paginatedCourses && paginatedCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
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
                                <TableHead className='cursor-pointer' onClick={() => { setSortColumn('program.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Program
                                    </div>
                                </TableHead>
                                <TableHead className='cursor-pointer' onClick={() => { setSortColumn('specialization.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Specialization
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => { setSortColumn('bulletin.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Bulletin
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => { setSortColumn('level.name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                        Level
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {paginatedCourses.map((course:any, index) => (
                                <TableRow key={index}>
                                    <TableCell >{course.code}</TableCell>
                                    <TableCell >{course.title}</TableCell>
                                    <TableCell className="text-center">
                                        {course.unit}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.course_type.name}
                                    </TableCell>
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
                                        <Button disabled={!canEdit} variant="outline" size="sm" onClick={() => handleEdit(course)}>Edit</Button>
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
        {isEditModalOpen && (
            <CourseModal
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
                message={`Are you sure you want to delete the course "${selectedCourse?.title}"?`}
            />
        )}
    </>
  )
}

export default CourseContent