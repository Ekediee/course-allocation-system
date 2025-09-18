import React from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, Loader2 } from 'lucide-react';
import EmptyPage from './EmptyPage';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminManagementModal from './AdminManagementModal';
import { Button } from "@/components/ui/button"

const AdminManagementContent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(13);
    const [selectedDepartment, setSelectedDepartment] = React.useState('');

    const {
        fetchAdminUsers, 
        isUploading,
        fetchDepartmentName
    } = useAppContext()

    const queryClient = useQueryClient();

    // I'll need a new query key and function
    const { data: userResult, isLoading, error } = useQuery<{ users: any[] }>({
        queryKey: ['adminUsers'],
        queryFn: fetchAdminUsers
    })

    const { data: departments } = useQuery({
        queryKey: ['departmentNames'],
        queryFn: fetchDepartmentName,
    });

    const userData = userResult?.users;
    
    const filteredUsers = userData?.filter((user: any) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDepartment ? user.department?.id === selectedDepartment : true)
    );

    const sortedUsers = filteredUsers?.sort((a: any, b: any) => {
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

    const totalPages = Math.ceil((sortedUsers?.length || 0) / itemsPerPage);
    const paginatedUsers = sortedUsers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <TabsContent value="users">
            <Card className="m-4">
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                                <input type="text" placeholder="Search..." className="border-0 focus:ring-0" onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <AdminManagementModal btnName="Add User" onAddUser={() => queryClient.invalidateQueries({ queryKey: ['adminUsers'] })}/>
                        </div>
                    </div>
                    {paginatedUsers && paginatedUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead onClick={() => { setSortColumn('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Name</TableHead>
                                <TableHead onClick={() => { setSortColumn('gender'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Gender</TableHead>
                                <TableHead onClick={() => { setSortColumn('email'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Email</TableHead>
                                <TableHead onClick={() => { setSortColumn('role'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Role</TableHead>
                                <TableHead onClick={() => { setSortColumn('department'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Department</TableHead>
                                <TableHead onClick={() => { setSortColumn('phone'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Phone</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {paginatedUsers.map((user:any) => (
                                <TableRow key={user.id}>
                                    <TableCell >{user.name}</TableCell>
                                    <TableCell >{user.gender}</TableCell>
                                    <TableCell >{user.email}</TableCell>
                                    <TableCell >{user.role}</TableCell>
                                    <TableCell >{user.department}</TableCell>
                                    <TableCell >{user.phone}</TableCell>
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
                            title="No User Available" 
                            desc="Add a new user to see details" 
                            btnName="Add User" 
                            onAddUser={() => queryClient.invalidateQueries({ queryKey: ['adminUsers'] })}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default AdminManagementContent;