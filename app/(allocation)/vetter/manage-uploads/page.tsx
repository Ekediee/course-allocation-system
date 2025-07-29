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
import { useAppContext } from '@/contexts/ContextProvider'
import BulletinContent from '@/components/ResourceUpload/Bulletin/BulletinContent'
import SchoolContent from '@/components/ResourceUpload/School/SchoolContent'

const Tab_Items = [
    'Session', 'Semester', 'Bulletin', 'School', 'Department', 'Program', 'Course', 'Users'
]

const ResourceUpload = () => {
    const {
        semesterData
    } = useAppContext()

    // To disable a Tab
    const disabledTabs: string[] = [];

    // if(semesterData?.length === 3){
    //     disabledTabs.push("Semester")
    // }
  return (
    <>
        <Tabs defaultValue="session" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-20">
                {Tab_Items.map((item, index) => (
                    <TabsTrigger key={index} value={item.toLowerCase()} className={disabledTabs?.includes(item) ? "pointer-events-none opacity-50 cursor-not-allowed" : "rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20"}>
                        {item}
                    </TabsTrigger>
                ))}
            </TabsList>
            <SessionContent />
            <SemesterContent />
            <BulletinContent />
            <SchoolContent />
            {/* Add other TabsContent for Semester, Bulletin, etc. */}
        </Tabs>
    </>
  )
}

export default ResourceUpload