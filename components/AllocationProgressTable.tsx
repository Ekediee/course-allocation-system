import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  Users,
} from "lucide-react";

const AllocationProgressTable = () => {
    const programProgress = [
        { 
          name: "Computer Science", 
          unallocated: 10, 
          progress: 60, 
          status: "In Progress" 
        },
        { 
          name: "Computer Technology", 
          unallocated: 21, 
          progress: 10, 
          status: "In Progress" 
        },
        { 
          name: "Computer Information Systems", 
          unallocated: 56, 
          progress: 0, 
          status: "Not Started" 
        }
    ];

  return (
    <Card>
        <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-medium">Allocation Progress</h3>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                Continue Allocation
                <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            </div>
            
            <div className="border-b border-gray-200 pb-3 grid grid-cols-12 text-sm font-medium text-gray-500">
            <div className="col-span-4">Programs</div>
            <div className="col-span-2">Unallocated</div>
            <div className="col-span-4">Progress</div>
            <div className="col-span-2">Status</div>
            </div>
            
            <div className="overflow-x-auto">
            {programProgress.map((program, index) => (
                <div key={index} className="py-3 grid grid-cols-12 items-center border-b border-gray-100">
                <div className="col-span-4 font-medium text-sm md:text-base">{program.name}</div>
                <div className="col-span-2 text-sm md:text-base">{program.unallocated}</div>
                <div className="col-span-4">
                    <div className="flex items-center gap-2">
                    <Progress value={program.progress} className="h-2" />
                    <span className="text-xs md:text-sm text-gray-500">{program.progress}%</span>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                    <Badge className={`${
                    program.status === "In Progress" 
                        ? "bg-orange-100 text-orange-600" 
                        : "bg-gray-100 text-gray-600"
                    } flex items-center gap-1 text-xs`}>
                    <span className={`w-2 h-2 rounded-full ${
                        program.status === "In Progress" 
                        ? "bg-orange-500" 
                        : "bg-gray-500"
                    }`}></span>
                    <span className="hidden md:inline">{program.status}</span>
                    <span className="md:hidden">{program.status === "In Progress" ? "In Prog." : "Not Started"}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="md:flex hidden">
                    <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
  )
}

export default AllocationProgressTable