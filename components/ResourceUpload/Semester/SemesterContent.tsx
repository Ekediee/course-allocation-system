import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../ui/button';
import { ArrowDownWideNarrow, ChevronDown, Plus } from 'lucide-react';
import { EmptyFolderIcon } from '../../EmptyFolder';
import EmptyPage from './EmptyPage';
import SemesterModal from './SemesterModal';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SemesterType } from '@/contexts/ContextProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SemesterContent = () => {
    const {
        semesterData, 
        fetchSemesters
    } = useAppContext()

    // const fetchSemesters = async () => {
    //     try {
    //         const res = await fetch('/api/manage-uploads/semester');
    //         if (!res.ok) throw new Error('Network error');
    //         const data = await res.json();
    //         setSemesterData(data); // Update state with fetched data
    //         return data
    //     } catch (error) {
    //         console.error('Failed to fetch semesters:', error);
    //     }
    // };

    useEffect(() => {
        fetchSemesters(); // Call the async function
    }, []);

    const queryResult = useQuery<SemesterType>({
        queryKey: ['session'],
        queryFn: fetchSemesters
    })

    const { isLoading, error } = queryResult;

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
    
  return (
    <>
        <TabsContent value="semester">
            <Card className="m-4">
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Semesters
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div> */}
                            {semesterData?.length < 2 && <SemesterModal btnName="Add Semester" onAddSemester={fetchSemesters}/>}
                        </div>
                    </div>
                    {semesterData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Semester Name</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {semesterData.map((semester:any) => (
                                <TableRow key={semester.id}>
                                    <TableCell >{semester.name}</TableCell>
                                    <TableCell className="text-center">
                                        {semester.is_active && <Badge variant="outline" className="text-green-500 bg-green-100">
                                            Active
                                        </Badge>}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No Semesters Available" 
                            desc="Create a new semester to see details" 
                            btnName="Add Semester" 
                            onAddSemester={fetchSemesters}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default SemesterContent