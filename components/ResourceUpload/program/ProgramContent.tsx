import React, { useEffect } from 'react'
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

const ProgramContent = () => {
    const {
        programData, 
        fetchPrograms,
        isUploading
    } = useAppContext()

    useEffect(() => {
        fetchPrograms();
    }, []);

    const queryResult = useQuery<SchoolType>({
        queryKey: ['programs'],
        queryFn: fetchPrograms
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

    if (isUploading) {
        <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Uploading...
        </div>
    }
  return (
    <>
        <TabsContent value="program">
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Program
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <ProgramModal btnName="Add Program" onAddProgram={fetchPrograms}/>
                        </div>
                    </div>
                    {programData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Program Name</TableHead>
                                <TableHead className="">Department</TableHead>
                                <TableHead className="text-center">Acronym</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {programData.map((program:any) => (
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