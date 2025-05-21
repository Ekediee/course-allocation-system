import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Blocks,
    BookOpen,
    FileText
  } from "lucide-react";
import { useAppContext } from '@/contexts/ContextProvider';
import { allocation_data } from '@/data/course_data';

const Stats = () => {
    const [departmentalLecturers, setDepartmentalLecturers] = useState(43);

    const {overallAllocationProgress} = useAppContext()
      
    const allocationProgress = overallAllocationProgress(allocation_data)
    const allocatedCourses = allocationProgress[0].allocatedCourses
    const totalCourses = allocationProgress[0].unallocatedCourses + allocatedCourses
    const programs = allocationProgress[0].totalPrograms
      
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="bg-green-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Programs</p>
                <Blocks className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{programs}</p>
            </CardContent>
        </Card>

        <Card className="bg-red-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Total Courses</p>
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{totalCourses}</p>
            </CardContent>
        </Card>

        <Card className="bg-blue-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Allocated Courses</p>
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{allocatedCourses}</p>
            </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
            <CardContent className="p-3 md:p-10">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-gray-600 text-sm">Dept. Lecturers</p>
                <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-2xl md:text-4xl font-bold">{departmentalLecturers}</p>
            </CardContent>
        </Card>
        
    </div>
  )
}

export default Stats