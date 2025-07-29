import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../ui/button';
import { ArrowDownWideNarrow, ChevronDown, Plus } from 'lucide-react';
import { EmptyFolderIcon } from '../../EmptyFolder';
import EmptyPage from './EmptyPage';
import SchoolModal from './SchoolModal';
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { SemesterType } from '@/contexts/ContextProvider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const SchoolContent = () => {
    const {
        schoolData, 
        fetchSchools
    } = useAppContext()

    useEffect(() => {
        fetchSchools(); // Call the async function
    }, []);

    const queryResult = useQuery<SemesterType>({
        queryKey: ['schools'],
        queryFn: fetchSchools
    })

    console.log("School Data: ", schoolData);

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
        <TabsContent value="school">
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Schools
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <SchoolModal btnName="Add School" onAddSchool={fetchSchools}/>
                        </div>
                    </div>
                    {schoolData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>School Name</TableHead>
                                <TableHead className="text-center">Acronym</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {schoolData.map((school:any) => (
                                <TableRow key={school.id}>
                                    <TableCell >{school.name}</TableCell>
                                    <TableCell className="text-center">
                                        {school.acronym}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No School Available" 
                            desc="Create a new school to see details" 
                            btnName="Add School" 
                            onAddSchool={fetchSchools}
                        />
                    )}
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default SchoolContent