import React, { useEffect, useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import EmptyPage from './EmptyPage';
import DepartmentModal from './DepartmentModal';
import { useAppContext } from '@/contexts/ContextProvider';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SchoolType } from '@/contexts/ContextProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToast } from '@/hooks/use-toast';
import { useTable } from '@/lib/useTable';

type DepartmentProps = {
  isCalledFromAdmin: boolean;
};

const DepartmentContent: React.FC<DepartmentProps> = ({ isCalledFromAdmin }) => {
    const { 
        departmentData,
        fetchDepartments,
        fetchAdminDepartments,
        isUploading, role
    } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(13);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { toast } = useToast();

    const canEdit = role === 'admin' || role === 'superadmin';

    useEffect(() => {
        isCalledFromAdmin ? fetchAdminDepartments() : fetchDepartments();
    }, [isCalledFromAdmin]);

    const queryResult = isCalledFromAdmin
        ? useQuery<SchoolType>({
            queryKey: ['departments'],
            queryFn: fetchAdminDepartments
        })
        : useQuery<SchoolType>({
            queryKey: ['departments'],
            queryFn: fetchDepartments
        });

    const { isLoading, error } = queryResult;

    // const filteredDepartments = departmentData?.filter((department: any) =>
    //     department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     department?.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     department?.acronym.toLowerCase().includes(searchTerm.toLowerCase()) 
    // );

    // const sortedDepartments = filteredDepartments?.sort((a: any, b: any) => {
    //     if (sortColumn) {
    //         const aValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj?.[key], a) : a[sortColumn];
    //         const bValue = sortColumn.includes('.') ? sortColumn.split('.').reduce((obj, key) => obj?.[key], b) : b[sortColumn];

    //         if (aValue < bValue) {
    //             return sortDirection === 'asc' ? -1 : 1;
    //         }
    //         if (aValue > bValue) {
    //             return sortDirection === 'asc' ? 1 : -1;
    //         }
    //     }
    //     return 0;
    // });

    // const totalPages = Math.ceil((sortedDepartments?.length || 0) / itemsPerPage);
    // const paginatedDepartments = sortedDepartments?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const { paginated: paginatedDepartments, totalPages } = useTable({
        data: departmentData ?? [],
        searchTerm,
        searchKeys: ['name', 'school', 'acronym'],
        sortColumn,
        sortDirection: sortDirection as 'asc' | 'desc',
        currentPage,
        itemsPerPage,
    });

    const handleEdit = (department: any) => {
        setSelectedDepartment(department);
        setIsEditModalOpen(true);
    };

    const handleDelete = (department: any) => {
        setSelectedDepartment(department);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedDepartment) {
            try {
                const res = await fetch(`/api/manage-uploads/department?id=${selectedDepartment.id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    toast({
                        variant: "success",
                        title: "Department Deleted",
                        description: `Department "${selectedDepartment.name}" has been deleted.`
                    });
                    isCalledFromAdmin ? fetchAdminDepartments() : fetchDepartments();
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

    if (isUploading) {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Uploading...
            </div>
        );
    }

    return (
        <>
            <TabsContent value="department">
                <Card className="m-4">
                    <CardContent>
                        <div className="flex justify-between items-center p-2 pt-4">
                            <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                                <input type="text" placeholder="Search..." className="border-0 focus:ring-0 w-96 p-2" onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <DepartmentModal btnName="Add Department" onDepartmentUpdate={isCalledFromAdmin ? fetchAdminDepartments : fetchDepartments} isCalledFromAdmin={isCalledFromAdmin}/>
                            </div>
                        </div>
                        {paginatedDepartments && paginatedDepartments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="cursor-pointer" onClick={() => { setSortColumn('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                                <div className="flex items-center">
                                                    <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                                    Department Name
                                                </div>
                                            </TableHead>
                                            <TableHead className="cursor-pointer" onClick={() => { setSortColumn('school'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                                <div className="flex items-center">
                                                    <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                                    School
                                                </div>
                                            </TableHead>
                                            <TableHead className="flex cursor-pointer justify-center" onClick={() => { setSortColumn('acronym'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                                <div className="flex items-center">
                                                    <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                                    Acronym
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedDepartments?.map((department:any) => (
                                            <TableRow key={department.id}>
                                                <TableCell >{department.name}</TableCell>
                                                <TableCell className="">
                                                    {department.school}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {department.acronym}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button disabled={!canEdit} variant="outline" size="sm" onClick={() => handleEdit(department)}>Edit</Button>
                                                    <Button disabled={!canEdit} variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(department)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-end items-center gap-2 mt-4">
                                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Prev</Button>
                                    <span>Page {currentPage} of {totalPages}</span>
                                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next <ChevronRight /></Button>
                                </div>
                            </div>
                        ) : (
                            <EmptyPage 
                                title="No Department Available" 
                                desc="Create a new department to see details" 
                                btnName="Add Department" 
                                onDepartmentUpdate={isCalledFromAdmin ? fetchAdminDepartments : fetchDepartments}
                                isCalledFromAdmin={isCalledFromAdmin}
                            />
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {isEditModalOpen && (
                <DepartmentModal
                    btnName="Edit Department"
                    isCalledFromAdmin={isCalledFromAdmin}
                    department={selectedDepartment}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onDepartmentUpdate={isCalledFromAdmin ? fetchAdminDepartments : fetchDepartments}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete the department "${selectedDepartment?.name}"?`}
                />
            )}
        </>
    );
}

export default DepartmentContent;