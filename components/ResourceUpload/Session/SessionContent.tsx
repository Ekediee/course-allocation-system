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

const SessionContent = () => {
    const {
        sessionData,
        setSessionData
    } = useAppContext()

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/manage-uploads/session');
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setSessionData(data?.session); // Update state with fetched data
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    useEffect(() => {
        fetchSessions(); // Call the async function
    }, []);

  console.log("Session data in SessionContent:", sessionData);
    
  return (
    <>
        <TabsContent value="session" >
            <Card className="">
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
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {sessionData.map((session:any) => (
                                <TableRow key={session.id}>
                                    <TableCell >{session.name}</TableCell>
                                    <TableCell >{session.is_active ? "Active" : "Inactive"}</TableCell>
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