"use client"
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from 'next/link';

import { Semester } from "@/data/constants";
import { allocation_data } from "@/data/course_data";
import { useAppContext } from '@/contexts/ContextProvider'
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AllocateLecturerModal from "@/components/AllocateLecturerModal";
import AllocationPage from "@/components/AllocationPage";

// const fetchSemesterData = async (): Promise<Semester[]> => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     return allocation_data;

// }

const CourseAllocation = () => {
    const {setPrevPath, 
    } = useAppContext()

    setPrevPath("/de-allocation");
    
    const allocationPage = "DE Allocation";


  return (
    <>
        <AllocationPage allocationPage={allocationPage} />
    </>
  )
}

export default CourseAllocation