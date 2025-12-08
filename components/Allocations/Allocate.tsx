'use client'
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/GroupCard";
import { ArrowLeft, Plus } from "lucide-react";

import { useAppContext } from '@/contexts/ContextProvider'
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"

import { allocation_data } from "@/data/course_data";
import AllocateLecturerModal from "@/components/Allocations/SubmitAllocationModal";
import { useToast } from "@/hooks/use-toast"
import VerifyAllocation from "@/components/Allocations/verifyAllocation";

const AllocateComponent = () => {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams();
  const { 
    department,
    selectedCourse,
    setSelectedCourse,
    selectedProgram, 
    updateCourse, 
    setAllocateCourse,
    groups, setGroups,
    token,
    utoken, uid 
  } = useAppContext()

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const isEditMode = !!selectedCourse?.isAllocated;

  // useEffect(() => {
  //   if (selectedCourse) {
  //       if (isEditMode) {
  //           // Reallocation: pre-fill with existing data
  //           setGroups([
  //               {
  //                   id: 0,
  //                   name: 'Group A',
  //                   lecturer: selectedCourse.allocatedTo,
  //                   classSize: '', // User needs to re-enter this
  //                   classHours: '-',
  //               }
  //           ]);
  //       } else {
  //           // New allocation: reset to a single default group
  //           setGroups([
  //               { id: 0, name: "Group A", lecturer: "", classSize: "", classHours: "-" },
  //           ]);
  //       }
  //   }
  // }, [selectedCourse, setGroups, isEditMode]);
  useEffect(() => {
    // Only run if selectedCourse is missing (e.g., after refresh)
    if (!selectedCourse) {
      const savedData = localStorage.getItem("allocate_page_persist_data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Restore the course
          setSelectedCourse(parsedData);
          // Note: If you have setters for Department or Program in context, call them here too.
        } catch (error) {
          console.error("Failed to restore data", error);
        }
      } else {
        // If no data is found and no course is selected, redirect back to list
        // This prevents the user from seeing an empty/broken page
        router.push('/course-allocation'); 
      }
    }
  }, [selectedCourse, setSelectedCourse, router]);

  useEffect(() => {
    if (selectedCourse) {
      localStorage.setItem("allocate_page_persist_data", JSON.stringify(selectedCourse));
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse) return;

    if (isEditMode) {
        
        const fetchAllocationDetails = async () => {
            setIsLoadingDetails(true);
            try {
                
                const res = await fetch(`/api/allocation/details?program_course_id=${selectedCourse.programCourseId}&semester_id=${selectedCourse.semesterId}`);
                const resdata = await res.json();

                if (resdata.status === 'success' && resdata.data.length > 0) {
                    // Map the fetched details to the 'groups' state format
                    const existingGroups = resdata.data.map((alloc:any, index:any) => ({
                        id: index,
                        name: alloc.groupName,
                        lecturer: alloc.lecturer, // Or lecturer ID if your Combobox uses IDs
                        classSize: alloc.classSize.toString(),
                        classOption: alloc.classOption,
                    }));
                    setGroups(existingGroups);
                } else {
                    // Handle case where no details are found (maybe reset to default)
                    setGroups([{ id: 0, name: "Group A", lecturer: "", classSize: "", classOption: "" }]);
                }
            } catch (error) {
                console.error("Failed to fetch allocation details:", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load existing allocation details." });
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchAllocationDetails();

    } else {
        // Reset to a single default group for a new allocation
        setGroups([
          { id: 0, name: "Group A", lecturer: "", classSize: "", classHours: "-" },
        ]);
    }
  }, [selectedCourse, setGroups, isEditMode, toast, token]);
  
  // console.log('Utoken ', utoken);
  // console.log('UId ', uid);
  const handleAddGroup = () => {
    const newId = groups.length;
    setGroups([
      ...groups,
      {
        id: newId,
        name: `Group ${String.fromCharCode(65 + newId)}`,
        lecturer: "",
        classSize: "",
        classOption: "",
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

  // const handleConfirmAllocation = async () => {

  //   const data: any[] = [];
  //   const missingFields: any[] = [];
    
  //   groups.forEach((group:any) => { 
  //     if (group.lecturer === "") missingFields.push("Lecturer");
  //     if (group.classSize === "") missingFields.push("Class Size");
  //     if (group.classOption === "") missingFields.push("Class Option");
      
  //     if (missingFields.length > 0) {
  //       const missingText = missingFields.join(", ");
  //       toast({
  //         variant: "destructive",
  //         title: "Allocation Failed",
  //         description: `Please provide input for all fields\nThe following fields are missing input:\n\n${missingText}`,
  //         className: "whitespace-pre-wrap",
  //       });
  //       return;
  //     }else {
  //       data.push({
  //         semesterId: selectedCourse?.semesterId,
  //         programId: selectedCourse?.programId,
  //         levelId: selectedCourse?.levelId,
  //         courseId: selectedCourse?.courseId,
  //         classSize: group.classSize,
  //         isAllocated: true,
  //         allocatedTo: group.lecturer,
  //         groupName: group.name,
  //         class_option: group.classOption,
  //       });
  //     }
      
  //   });

  //   if (data.length < groups.length) {
  //       return; // Stop if form is incomplete
  //   }
    
  //   const allocatedCourse = JSON.stringify(data)

  //   const res = await fetch(`/api/allocation?token=${token}`,{
  //     method: 'POST',
  //     body: allocatedCourse
  //   });

  //   const resdata = await res.json();

  //   if(resdata.status == "success") {
  //     toast({
  //       variant: "success",
  //       title: "Lecturer Allocated:",
  //       description: resdata.message
  //     })
  //   }else if(resdata.error.status == "error") {
  //     toast({
  //       variant: "destructive",
  //       title: "Allocation Failed",
  //       description: resdata.error.message
  //     })
  //   } 

  //   localStorage.removeItem("allocate_page_persist_data");
  //   setSelectedCourse(null);
    
  //   router.push(`/${from}`);
  // };

  const handleConfirmAllocation = async () => {
    // VALIDATE ALL GROUPS FIRST
    const allErrors: string[] = [];

    groups.forEach((group: any) => {
        const missingFieldsForGroup: string[] = [];
        
        if (!group.lecturer) missingFieldsForGroup.push("Lecturer");
        if (!group.classSize) missingFieldsForGroup.push("Class Size");
        if (!group.classOption) missingFieldsForGroup.push("Class Option");

        if (missingFieldsForGroup.length > 0) {
            allErrors.push(
                `These fields are missing in ${group.name}:\n ${missingFieldsForGroup.join(', ')}`
            );
        }
    });

    // CHECK IF ANY ERRORS WERE FOUND
    if (allErrors.length > 0) {
        toast({
            variant: "destructive",
            title: "Incomplete Allocation",
            description: `Please fix the following errors before submitting:\n\n${allErrors.join('\n')}`,
            className: "whitespace-pre-wrap", // Ensures newlines are respected
        });
        return; // Stop the entire function
    }

    // IF VALIDATION PASSES, PREPARE DATA AND SUBMIT
    // At this point, you know all groups are valid.
    const data = groups.map((group: any) => ({
        semesterId: selectedCourse?.semesterId,
        programId: selectedCourse?.programId,
        levelId: selectedCourse?.levelId,
        courseId: selectedCourse?.courseId,
        classSize: group.classSize,
        isAllocated: true,
        allocatedTo: group.lecturer,
        groupName: group.name,
        class_option: group.classOption,
    }));
    
    const allocatedCourse = JSON.stringify(data);

    try {
        const res = await fetch(`/api/allocation?token=${token}`, {
            method: 'POST',
            body: allocatedCourse
        });

        const resdata = await res.json();

        // Check for a successful response (status code 2xx)
        if (res.ok) {
            toast({
                variant: "success",
                title: "Lecturer Allocated:",
                description: resdata.message
            });
            localStorage.removeItem("allocate_page_persist_data");
            setSelectedCourse(null);
            router.push(`/${from}`);
        } else {
            // If the response is not ok, throw an error to be caught by the catch block
            throw new Error(resdata.message || "An unknown error occurred during allocation.");
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Allocation Failed",
            description: (error as Error).message,
        });
    }
  };

  // const handleUpdateAllocation = async () => {
  //   const data: any[] = [];
  //   const missingFields: any[] = [];

  //   groups.forEach((group:any) => {  
  //     if (group.lecturer === "") missingFields.push("Lecturer");
  //     if (group.classSize === "") missingFields.push("Class Size");
  //     if (group.classOption === "") missingFields.push("Class Option");

  //     if (missingFields.length > 0) {
  //       const missingText = missingFields.join(", ");
  //       toast({
  //         variant: "destructive",
  //         title: "Allocation Failed",
  //         description: `Please provide input for all fields\nThe following fields are missing input:\n\n${missingText}`,
  //         className: "whitespace-pre-wrap",
  //       });
  //       return;
  //     } else {
  //       data.push({
  //         semesterId: selectedCourse?.semesterId,
  //         programId: selectedCourse?.programId,
  //         levelId: selectedCourse?.levelId,
  //         courseId: selectedCourse?.courseId,
  //         classSize: group.classSize,
  //         isAllocated: true,
  //         allocatedTo: group.lecturer,
  //         groupName: group.name,
  //         class_option: group.classOption,
  //       });
  //     }
  //   });

  //   if (data.length < groups.length) {
  //       return; // Stop if form is incomplete
  //   }
    
  //   const updatedAllocation = JSON.stringify(data)

  //   const res = await fetch(`/api/allocation?token=${token}`,{
  //     method: 'PUT',
  //     body: updatedAllocation
  //   });

  //   const resdata = await res.json();

  //   if(resdata.status == "success") {
  //     toast({
  //       variant: "success",
  //       title: "Allocation Updated:",
  //       description: resdata.message
  //     })
  //   } else if(resdata.status == "error") {
  //     toast({
  //       variant: "destructive",
  //       title: "Update Failed",
  //       description: resdata.message
  //     })
  //   } 

  //   localStorage.removeItem("allocate_page_persist_data");
  //   setSelectedCourse(null);
  //   router.push(`/${from}`);
  // };

  const handleUpdateAllocation = async () => {
    // VALIDATE ALL GROUPS FIRST
    const allErrors: string[] = [];

    groups.forEach((group: any) => {
        const missingFieldsForGroup: string[] = [];
        
        if (!group.lecturer) missingFieldsForGroup.push("Lecturer");
        if (!group.classSize) missingFieldsForGroup.push("Class Size");
        if (!group.classOption) missingFieldsForGroup.push("Class Option");

        if (missingFieldsForGroup.length > 0) {
            allErrors.push(
                `These fields are missing in ${group.name}: \n${missingFieldsForGroup.join(', ')}`
            );
        }
    });

    // CHECK IF ANY ERRORS WERE FOUND
    if (allErrors.length > 0) {
        toast({
            variant: "destructive",
            title: "Incomplete Allocation",
            description: `Please fix the following errors before submitting:\n\n${allErrors.join('\n')}`,
            className: "whitespace-pre-wrap", // Ensures newlines are respected
        });
        return; // Stop the entire function
    }

    // IF VALIDATION PASSES, PREPARE DATA AND SUBMIT
    // At this point, you know all groups are valid.
    const data = groups.map((group: any) => ({
        semesterId: selectedCourse?.semesterId,
        programId: selectedCourse?.programId,
        levelId: selectedCourse?.levelId,
        courseId: selectedCourse?.courseId,
        classSize: group.classSize,
        isAllocated: true,
        allocatedTo: group.lecturer,
        groupName: group.name,
        class_option: group.classOption,
    }));
    
    const updatedAllocation = JSON.stringify(data);

    try {
        const res = await fetch(`/api/allocation?token=${token}`, {
            method: 'PUT',
            body: updatedAllocation
        });

        const resdata = await res.json();

        if (res.ok) { // Check for successful status codes (2xx)
            toast({
                variant: "success",
                title: "Allocation Updated:",
                description: resdata.message
            });
            localStorage.removeItem("allocate_page_persist_data");
            setSelectedCourse(null);
            router.push(`/${from}`);
        } else {
            throw new Error(resdata.message || "An unknown error occurred");
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: (error as Error).message,
        });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-gradient-to-r from-amber-200 to-amber-50 rounded-2xl p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300">
          <h2 className="text-xl font-medium mb-5">
            {isEditMode ? 'Update Course Allocation' : 'Allocate Lecturer'}
          </h2>

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

            <Button 
              size="sm" 
              className="bg-blue-700 hover:bg-blue-800"
              onClick={isEditMode ? handleUpdateAllocation : handleConfirmAllocation}
            >
              {isEditMode ? 'Update Allocation' : 'Confirm Allocation'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-blue-800">
            <h3 className="text-lg font-medium mb-2">Department:</h3>
            <p className="text-lg">{department}</p>
          </div>
          
          <div className="text-blue-800">
            <h3 className="text-lg font-medium mb-2">Program:</h3>
            <p className="text-lg">{selectedProgram ? selectedProgram : selectedCourse?.programName}</p>
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

export default AllocateComponent