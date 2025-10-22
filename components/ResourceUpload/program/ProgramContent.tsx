import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownWideNarrow, ChevronDown, Loader2, Plus } from 'lucide-react';
import EmptyPage from './EmptyPage';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SchoolType } from '@/contexts/ContextProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProgramModal from './ProgramModal';
import { Button } from '@/components/ui/button';
import SearchTable from '@/components/SearchTable';

const ProgramContent = () => {
    const {
        programData, 
        fetchPrograms,
        isUploading
    } = useAppContext()

    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(13);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const queryResult = useQuery<SchoolType>({
        queryKey: ['programs'],
        queryFn: fetchPrograms
    })

    const { isLoading, error } = queryResult;

    const filteredPrograms = programData?.filter((program: any) =>
        program?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.acronym.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    const sortedPrograms = filteredPrograms?.sort((a: any, b: any) => {
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

    const totalPages = Math.ceil((sortedPrograms?.length || 0) / itemsPerPage);
    const paginatedPrograms = sortedPrograms?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <TabsContent value="program">
            <Card className="m-4">
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <SearchTable setSearchTerm={setSearchTerm} />
                        <div className="flex items-center gap-2">
                            <ProgramModal btnName="Add Program" onAddProgram={fetchPrograms}/>
                        </div>
                    </div>
                    {paginatedPrograms && paginatedPrograms?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => { setSortColumn('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                    <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                    Program Name
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => { setSortColumn('department'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                                    <div className="flex items-center">
                                    <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                                    Department
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
                            {paginatedPrograms.map((program:any) => (
                                <TableRow key={program.id}>
                                    <TableCell >{program.name}</TableCell>
                                    <TableCell className="">
                                        {program.department}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {program.acronym}
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
                            title="No Program Available" 
                            desc="Create a new program to see details" 
                            btnName="Add Program" 
                            onAddProgram={fetchPrograms}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default ProgramContent