'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/GroupCard";
import { ArrowLeft, Plus } from "lucide-react";

import { useAppContext } from '@/contexts/ContextProvider'
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"

import { allocation_data } from "@/data/course_data";
import AllocateLecturerModal from "@/components/AllocateLecturerModal";
import { useToast } from "@/hooks/use-toast"
import VerifyAllocation from "@/components/verifyAllocation";

const Allocate = () => {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams();
  const { 
    selectedCourse,
    setSelectedCourse, 
    updateCourse, 
    setAllocateCourse,
    groups, setGroups,
    token 
  } = useAppContext()
  

  const handleAddGroup = () => {
    const newId = groups.length;
    setGroups([
      ...groups,
      {
        id: newId,
        name: `Group ${String.fromCharCode(65 + newId)}`,
        lecturer: "-",
        classSize: "-",
        classHours: "-",
      },
    ]);
  };

  const handleDeleteGroup = (id: number) => {
    // First group cannot be deleted
    if (id === 0) return;
    
    setGroups(groups.filter((group:any) => group.id !== id));
  };

  const handleUpdateGroup = (id: number, field: string, value: string) => {
    setGroups(
      groups.map((group:any) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  };

  const from = searchParams.get('from') || 'course-allocation';

  const handleConfirmAllocation = async () => {

    const data: any[] = [];

    groups.forEach((group:any) => {      
      
      if (group.lecturer === "" || group.classSize === "") {
        toast({
          variant: "destructive",
          title: "Allocation Failed",
          description: "Please fill the allocation form to continue.",
        });
        return;
      }else {
        data.push({
          semesterId: selectedCourse?.semesterId,
          programId: selectedCourse?.programId,
          levelId: selectedCourse?.levelId,
          courseId: selectedCourse?.courseId,
          classSize: group.classSize,
          isAllocated: true,
          allocatedTo: group.lecturer,
          groupName: group.name,
        });
      }
      
    });

    const allocatedCourse = JSON.stringify(data)

    const res = await fetch(`/api/allocation?token=${token}`,{
      method: 'POST',
      body: allocatedCourse
    });

    const resdata = await res.json();

    if(resdata.status == "success") {
      toast({
        variant: "success",
        title: "Lecturer Allocated:",
        description: resdata.message
      })
    }else if(resdata.status == "error") {
      toast({
        variant: "destructive",
        title: "Allocation Failed",
        description: resdata.message
      })
    } 

    // resdata.forEach((data: any) =>{
    //   toast({
    //     variant: "success",
    //     title: "Lecturer Allocated for:",
    //     description: data.code + " - " + data.title
    //   })
    // })

    // Unset course selection
    setSelectedCourse(null);
    
    router.push(`/${from}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-amber-200 to-amber-50 rounded-2xl p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300">
          <h2 className="text-xl font-medium mb-5">Allocate Lecturer</h2>

          <div className="flex justify-end items-center gap-4">
            <Link 
              href={{
                  pathname:"/course-allocation"
              }} 
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                Go back to list
              </Button>
            </Link>


            {/* <VerifyAllocation onAllocate={handleConfirmAllocation} /> */}
            {/* <Link 
              href={{
                  pathname:"/course-allocation"
              }} 
            > */}
              <Button 
                size="sm" 
                className="bg-blue-700 hover:bg-blue-800"
                onClick={handleConfirmAllocation}
              >
                Confirm Allocation
              </Button>
            {/* </Link> */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-blue-800">
            <h3 className="text-lg font-medium mb-2">Department:</h3>
            <p className="text-lg">Computer Science</p>
          </div>
          
          <div className="text-blue-800">
            <h3 className="text-lg font-medium mb-2">Program:</h3>
            <p className="text-lg">{selectedCourse?.programName}</p>
          </div>
          
          <div className="text-blue-800">
            <h3 className="text-lg font-medium mb-2">Course:</h3>
            <p className="text-lg">{selectedCourse?.courseCode} - {selectedCourse?.courseTitle}</p>
          </div>
        </div>
      </div>
      
      
      
      <div className='max-w-6xl mx-auto'>
        {groups.map((group:any) => (
          <GroupCard
            key={group.id}
            group={group}
            onDelete={handleDeleteGroup}
            onUpdate={handleUpdateGroup}
            showDelete={group.id !== 0} // First group cannot be deleted
          />
        ))}
        
        <Button
          variant="outline"
          className="w-full py-6 border-dashed flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50"
          onClick={handleAddGroup}
        >
          <Plus size={18} />
          Add a new group
        </Button>
      </div>
    </div>
  );
}

export default Allocate