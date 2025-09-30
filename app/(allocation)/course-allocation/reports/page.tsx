import React, { Suspense } from 'react'
import CourseAllocationReport from '@/components/Reports/AllocationReport'

const AllocationReport = () => {
  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <CourseAllocationReport />
        </Suspense>
    </>
  )
}

export default AllocationReport