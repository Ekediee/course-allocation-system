import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  Users,
} from "lucide-react";

import { useAppContext } from '@/contexts/ContextProvider'
// import { allocation_data } from "@/data/course_data";
import { useQuery } from "@tanstack/react-query";
import { Semester } from "@/data/constants";
import Link from 'next/link';

const AllocationProgressTable = () => {
  const {computeAllocationProgress, fetchSemesterData} = useAppContext()

  const queryResult = useQuery<Semester[]>({
        queryKey: ['semesters'],
        queryFn: fetchSemesterData
    });

    const { data: allocation_data, isLoading, error } = queryResult;


    const programProgress = computeAllocationProgress(allocation_data)
    
    // [
    //     { 
    //       name: "Computer Science", 
    //       unallocated: 10, 
    //       progress: 60, 
    //       status: "In Progress" 
    //     },
    //     { 
    //       name: "Computer Technology", 
    //       unallocated: 21, 
    //       progress: 82.5, 
    //       status: "In Progress" 
    //     },
    //     { 
    //       name: "Computer Information Systems", 
    //       unallocated: 56, 
    //       progress: 0, 
    //       status: "Not Started" 
    //     }
    // ];

  return (
    <Card>
        <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-medium">Allocation Progress</h3>
            </div>
            <Link
                href={{ pathname: "/course-allocation" }}
            >
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                    Continue Allocation
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
            </div>
            
            <div className="border-b border-gray-200 pb-3 grid grid-cols-12 text-sm font-medium text-gray-500">
            <div className="col-span-2">Semester</div>
            <div className="col-span-3">Programs</div>
            <div className="col-span-2">Unallocated</div>
            <div className="col-span-3">Progress</div>
            <div className="col-span-2">Status</div>
            </div>
            
            <div className="overflow-x-auto">
            {programProgress.map((program: any, index: any) => (
                <div key={index} className="py-3 grid grid-cols-12 items-center border-b border-gray-100">
                <div className="col-span-2 font-medium text-sm md:text-base capitalize">{program.semesterName}</div>
                <div className="col-span-3 font-medium text-sm md:text-base">{program.programName}</div>
                <div className="col-span-2 text-sm md:text-base">{program.unallocatedCourses}</div>
                <div className="col-span-3 pr-4">
                    <div className="flex items-center gap-2">
                    <Progress value={program.allocationRate} className="h-2" />
                    <span className="text-xs md:text-sm text-gray-500">{program.allocationRate}%</span>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                    <Badge className={`${
                    program.status === "In Progress" 
                        ? "bg-orange-100 text-orange-600" 
                        : program.status === "Completed" 
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    } flex items-center gap-1 text-xs`}>
                    <span className={`w-2 h-2 rounded-full ${
                        program.status === "In Progress" 
                        ? "bg-orange-500" 
                        : program.status === "Completed" 
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}></span>
                    <span className="hidden md:inline">{program.status}</span>
                    <span className="md:hidden">{program.status === "In Progress" ? "In Prog." : "Not Started"}</span>
                    </Badge>
                    {/* <Button variant="ghost" size="icon" className="md:flex hidden">
                    <ChevronRight className="w-4 h-4" />
                    </Button> */}
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  )
}

export default AllocationProgressTable