import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import DonutChart from '../DonutChart';
import { useAppContext } from '@/contexts/ContextProvider';
// import { allocation_data } from '@/data/course_data';
import { useQuery } from "@tanstack/react-query";
import { Semester } from "@/data/constants";

const AllocationProgress = () => {
    const {overallAllocationProgress, fetchSemesterData} = useAppContext()

    const queryResult = useQuery<Semester[]>({
        queryKey: ['semesters'],
        queryFn: fetchSemesterData
    });
        
    const { data: allocation_data, isLoading, error } = queryResult;

    const allocationProgress = overallAllocationProgress(allocation_data)
  return (
    <Card className="mb-4 md:mb-6 md:h-[194px] md:items-center md:flex">
        <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center">
            {/* <div className="relative h-20 w-20 md:h-24 md:w-24 mb-4 md:mb-0">
                <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-medium">25%</p>
                </div>
                <svg className="h-20 w-20 md:h-24 md:w-24" viewBox="0 0 100 100">
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="10" 
                    />
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="188.4"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
            </div> */}
            <DonutChart value={allocationProgress[0].allocationRate} size={120} />
            <div className="md:ml-6 text-center md:text-left">
                <h3 className="text-lg font-medium">Allocation is incomplete</h3>
                <p className="text-gray-500 text-sm md:text-base">You have courses that are yet to be allocated, kindly see the breakdown below</p>
            </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default AllocationProgress