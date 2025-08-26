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
import SpecializationModal from './SpecializationModal';

const SpecializationContent = () => {
    const {
        specializationData, 
        fetchSpecializations,
        isUploading
    } = useAppContext()

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const queryResult = useQuery<SchoolType>({
        queryKey: ['specializations'],
        queryFn: fetchSpecializations
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
        <TabsContent value="specialization">
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Specialization
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <SpecializationModal btnName="Add Specialization" onAddSpecialization={fetchSpecializations}/>
                        </div>
                    </div>
                    {specializationData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Specialization Name</TableHead>
                                <TableHead className="">Program</TableHead>
                                <TableHead className="">Department</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {specializationData.map((specialization:any) => (
                                <TableRow key={specialization.id}>
                                    <TableCell >{specialization.name}</TableCell>
                                    <TableCell className="">
                                        {specialization.program}
                                    </TableCell>
                                    <TableCell className="">
                                        {specialization.department}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No Specialization Available" 
                            desc="Create a new specialization to see details" 
                            btnName="Add Specialization" 
                            onAddSpecialization={fetchSpecializations}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default SpecializationContent