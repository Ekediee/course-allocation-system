
import React from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import EmptyPage from './EmptyPage';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserModal from './UserModal';
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast';
import { useTable } from '@/lib/useTable';
import DeleteConfirmationModal from '../department/DeleteConfirmationModal';
import { Input } from '@/components/ui/input';
import SearchTable from '@/components/SearchTable';
// import { Combobox } from '@/components/ui/combobox';

const UserContent = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('');
    const [sortDirection, setSortDirection] = React.useState('asc');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(13);
    const [selectedDepartment, setSelectedDepartment] = React.useState('');
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const { toast } = useToast();

    const {
        fetchUsers,
        isUploading,
        fetchDepartmentName,
        role
    } = useAppContext()

    const queryClient = useQueryClient();
    const canEdit = role === 'admin' || role === 'superadmin';

    const { data: userResult, isLoading, error } = useQuery<{ users: any[] }>({
        queryKey: ['users'],
        queryFn: fetchUsers
    })

    const { data: departments } = useQuery({
        queryKey: ['departmentNames'],
        queryFn: fetchDepartmentName,
    });

    const userData = userResult?.users;
    
    const { paginated: paginatedUsers, totalPages } = useTable({
        data: userData ?? [],
        searchTerm,
        searchKeys: ['name', 'email', 'role', 'rank', 'department', 'qualification', 'area_of_specialization'],
        sortColumn,
        sortDirection: sortDirection as 'asc' | 'desc',
        currentPage,
        itemsPerPage,
    });

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            try {
                const res = await fetch(`/api/manage-uploads/user?id=${selectedUser.id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    toast({
                        variant: "success",
                        title: "User Deleted",
                        description: `User "${selectedUser.name}" has been deleted.`
                    });
                    queryClient.invalidateQueries({ queryKey: ['users'] });
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
        <TabsContent value="lecturers">
            <Card className="m-4">
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <SearchTable setSearchTerm={setSearchTerm} />
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <UserModal btnName="Add Lecturer" onAddUser={() => queryClient.invalidateQueries({ queryKey: ['users'] })}/>
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
                                <TableHead onClick={() => { setSortColumn('rank'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Rank</TableHead>
                                <TableHead onClick={() => { setSortColumn('department'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Department</TableHead>
                                <TableHead onClick={() => { setSortColumn('qualification'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Qualification</TableHead>
                                <TableHead onClick={() => { setSortColumn('specialization'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>Area of Specialization</TableHead>
                                <TableHead>Other Responsibilities</TableHead>
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
                                    <TableCell >{user.rank}</TableCell>
                                    <TableCell >{user.department}</TableCell>
                                    <TableCell className="text-center">{user.qualification}</TableCell>
                                    <TableCell className="text-center">{user.specialization}</TableCell>
                                    <TableCell className="text-center">{user.other_responsibilities ? user.other_responsibilities : ""}</TableCell>
                                    <TableCell className="text-center">
                                        <Button disabled={!canEdit} variant="outline" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                                        <Button disabled={!canEdit} variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(user)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                            <div className="flex justify-end items-center gap-2 mt-4">
                                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft /> Prev</Button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next <ChevronRight /></Button>
                            </div>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No Lecturer Available" 
                            desc="Add a new lecturer to see details" 
                            btnName="Add Lecturer" 
                            onAddUser={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
        {isEditModalOpen && (
            <UserModal
                btnName="Edit User"
                user={selectedUser}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onAddUser={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            />
        )}

        {isDeleteModalOpen && (
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                message={`Are you sure you want to delete the user "${selectedUser?.name}"?`}
            />
        )}
    </>
  )
}

export default UserContent
