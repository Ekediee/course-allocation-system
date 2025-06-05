'use client'
import AllocationPage from "@/components/AllocationPage";
import { useAppContext } from '@/contexts/ContextProvider'


const CourseAllocation = () => {
    const {setPrevPath, 
    } = useAppContext()

    // setPrevPath("/course-allocation");

    const allocationPage = "Course Allocation";

  return (
    <>
        <AllocationPage allocationPage={allocationPage} url="course-allocation" />
    </>
  )
}

export default CourseAllocation