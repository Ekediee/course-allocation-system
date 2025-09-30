import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, Loader2, Plus } from 'lucide-react';
import EmptyPage from './EmptyPage';
import DepartmentModal from './DepartmentModal';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SchoolType } from '@/contexts/ContextProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button"

type DepartmentProps = {
  isCalledFromAdmin: boolean;
};

const departmentContent: React.FC<DepartmentProps> = ({ isCalledFromAdmin }) => {
    const { 
        departmentData,
        fetchDepartments,
        fetchAdminDepartments,
        isUploading
    } = useAppContext()
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(13);

    useEffect(() => {
        isCalledFromAdmin ? fetchAdminDepartments() : fetchDepartments()
    }, [isCalledFromAdmin]);

    const queryResult = isCalledFromAdmin
        ? useQuery<SchoolType>({
            queryKey: ['departments'],
            queryFn: fetchAdminDepartments
        })
        : useQuery<SchoolType>({
            queryKey: ['departments'],
            queryFn: fetchDepartments
        })

        
        const { isLoading, error } = queryResult;

        const filteredDepartments = departmentData?.filter((department: any) =>
            department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            department?.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
            department?.acronym.toLowerCase().includes(searchTerm.toLowerCase()) 
        );

        const sortedDepartments = filteredDepartments?.sort((a: any, b: any) => {
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

        const totalPages = Math.ceil((sortedDepartments?.length || 0) / itemsPerPage);
        const paginatedDepartments = sortedDepartments?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        
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
        <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Uploading...
        </div>
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
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <DepartmentModal btnName="Add Department" onAddDepartment={isCalledFromAdmin ? fetchAdminDepartments : fetchDepartments} isCalledFromAdmin={isCalledFromAdmin}/>
                        </div>
                    </div>
                    {paginatedDepartments && paginatedDepartments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead onClick={() => { setSortColumn('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Department Name</TableHead>
                                <TableHead onClick={() => { setSortColumn('school'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>School</TableHead>
                                <TableHead className="text-center" onClick={() => { setSortColumn('acronym'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Acronym</TableHead>
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
                            title="No Department Available" 
                            desc="Create a new department to see details" 
                            btnName="Add Department" 
                            onAddDepartment={isCalledFromAdmin ? fetchAdminDepartments : fetchDepartments}
                            isCalledFromAdmin={isCalledFromAdmin}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default departmentContent