import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../ui/button';
import { ArrowDownWideNarrow, ChevronDown, Plus } from 'lucide-react';
import { EmptyFolderIcon } from '../../EmptyFolder';
import EmptyPage from './EmptyPage';
import SessionModal from './SessionModal';
import { useAppContext } from '@/contexts/ContextProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Academic_Session } from '@/contexts/ContextProvider';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const SessionContent = () => {
    const {
        sessionData,
        setSessionData,
    } = useAppContext()

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/manage-uploads/session');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setSessionData(data?.session); // Update state with fetched data
            return data
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    useEffect(() => {
        fetchSessions(); // Call the async function
    }, []);

  const queryResult = useQuery<Academic_Session>({
        queryKey: ['session'],
        queryFn: fetchSessions
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
        <TabsContent value="session" >
            <Card className="m-4">
                <CardContent className="">
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Active Session
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <SessionModal btnName="Active Session" onSessionAdded={fetchSessions} />
                        </div>
                    </div>
                    {sessionData?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Session Name</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {sessionData.map((session:any) => (
                                <TableRow key={session.id}>
                                    <TableCell >{session.name}</TableCell>
                                    <TableCell className="text-center">
                                        {session.is_active && <Badge variant="outline" className="text-green-500 bg-green-100">
                                            {session.is_active ? "Active" : "Inactive"}
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
                            title="No Sessions Available" 
                            desc="Create a new session to see details" 
                            btnName="Active Session" 
                            onSessionAdded={fetchSessions} // Call fetchSessions when a new session is added
                        />
                    )}
                    
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default SessionContent