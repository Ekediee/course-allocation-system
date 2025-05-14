import React from 'react'
import AllocationProgress from './AllocationProgress'
import AllocationProgressTable from './AllocationProgressTable'

const AllocationStatus = () => {
  return (
    <div className="lg:col-span-2">
        {/* Allocation Progress */}
        <AllocationProgress />

        {/* Progress Table */}
        <AllocationProgressTable />
    </div>
  )
}

export default AllocationStatus