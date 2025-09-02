'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminManagementContent from '@/components/AdminManagement/AdminManagementContent';
import DepartmentContent from '@/components/ResourceUpload/department/DepartmentContent';

const Tab_Items = [
    'Users', 'Department'
]

const AdminManagement = () => {
  return (
    <>
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-20">
                {Tab_Items.map((item, index) => (
                    <TabsTrigger key={index} value={item.toLowerCase()} className={"rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20"}>
                        {item}
                    </TabsTrigger>
                ))}
            </TabsList>
            <AdminManagementContent />
            <DepartmentContent isCalledFromAdmin={true} />
        </Tabs>
    </>
  )
}

export default AdminManagement;