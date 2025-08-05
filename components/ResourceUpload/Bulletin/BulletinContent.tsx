import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../ui/button';
import { ArrowDownWideNarrow, ChevronDown, Plus } from 'lucide-react';
import { EmptyFolderIcon } from '../../EmptyFolder';
import { useAppContext } from '@/contexts/ContextProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Academic_Session, Bulletin } from '@/contexts/ContextProvider';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import BulletinModal from './BulletinModal';
import EmptyPage from './EmptyPage';

const BulletinContent = () => {
    const {
        bulletinData,
        setBulletinData
    } = useAppContext()

    const fetchBulletins = async () => {
        try {
            const res = await fetch('/api/manage-uploads/bulletin');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setBulletinData(data?.bulletins); // Update state with fetched data
            return data
        } catch (error) {
            console.error('Failed to fetch bulletins:', error);
        }
    };

    useEffect(() => {
        fetchBulletins(); // Call the async function
    }, []);

  const queryResult = useQuery<Bulletin>({
        queryKey: ['bulletin'],
        queryFn: fetchBulletins
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
        <TabsContent value="bulletin" >
            <Card className="">
                <CardContent className="">
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Active Bulletin
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <BulletinModal btnName="Active Bulletin" onAddBulletin={fetchBulletins} />
                        </div>
                    </div>
                    {bulletinData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Bulletin Name</TableHead>
                                <TableHead className="text-center">Start Year</TableHead>
                                <TableHead className="text-center">End Year</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                {/* <TableHead className="text-center">Action</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {bulletinData.map((bulletin:any) => (
                                <TableRow key={bulletin.id}>
                                    <TableCell >{bulletin.name}</TableCell>
                                    <TableCell className="text-center">
                                        {bulletin.start_year}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {bulletin.end_year}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {bulletin.is_active && <Badge variant="outline" className="text-green-500 bg-green-100">
                                            {bulletin.is_active ? "Active" : "Inactive"}
                                        </Badge>}
                                    </TableCell>
                                    <TableCell className="text-center"></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyPage 
                            title="No Bulletin Available" 
                            desc="Create a new bulletin to see details" 
                            btnName="Active Bulletin" 
                            onAddBulletin={fetchBulletins} // Call fetchSessions when a new session is added
                        />
                    )}
                    
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default BulletinContent