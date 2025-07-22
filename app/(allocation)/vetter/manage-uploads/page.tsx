'use client'
import AllocationStatus from '@/components/Allocations/AllocationStatus'
import RequestView from '@/components/RequestView'
import Stats from '@/components/Stats'
import Welcome from '@/components/Welcome'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from 'inspector/promises'
import SessionContent from '@/components/ResourceUpload/Session/SessionContent'
import SemesterContent from '@/components/ResourceUpload/Semester/SemesterContent'

const Tab_Items = [
    'Session', 'Semester', 'Bulletin', 'School', 'Department', 'Program', 'Course', 'Users'
]

const ResourceUpload = () => {
  return (
    <>
        <Tabs defaultValue="session" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-20">
                {Tab_Items.map((item, index) => (
                    <TabsTrigger key={index} value={item.toLowerCase()} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
                        {item}
                    </TabsTrigger>
                ))}
            </TabsList>
            <SessionContent />
            <SemesterContent />
            {/* Add other TabsContent for Semester, Bulletin, etc. */}
        </Tabs>
    </>
  )
}

export default ResourceUpload