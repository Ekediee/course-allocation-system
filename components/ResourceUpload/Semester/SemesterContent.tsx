import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../../ui/button';
import { ArrowDownWideNarrow, ChevronDown, Plus } from 'lucide-react';
import { EmptyFolderIcon } from '../../EmptyFolder';
import EmptyPage from './EmptyPage';
import SemesterModal from './SemesterModal';

const SemesterContent = () => {
  return (
    <>
        <TabsContent value="semester">
            <Card>
                <CardContent>
                    <div className="flex justify-between items-center p-2 pt-4">
                        <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                            Semester
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center p-2 rounded-lg bg-white shadow-md">
                                <ArrowDownWideNarrow className="h-4 w-4 mr-2" /> Sort by <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                            <SemesterModal btnName="Add Semester" />
                        </div>
                    </div>
                    <EmptyPage 
                        title="No Semesters Available" 
                        desc="Create a new semester to see details" 
                        btnName="Add Semester" 
                    />
                    
                </CardContent>
            </Card>
        </TabsContent>
    </>
  )
}

export default SemesterContent