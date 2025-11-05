'use client'
import AllocationStatus from '@/components/Allocations/AllocationStatus'
import RequestView from '@/components/RequestView'
import Stats from '@/components/Stats'
import Welcome from '@/components/Welcome'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 overflow-y-auto">
        <Welcome />

        {/* Stats Cards */}
        <Stats />

        {/* Allocation Status */}
        <div className="justify-center items-center">
            <AllocationStatus />

            {/* Request View */}
            {/* <RequestView /> */}
        </div>
    </div>
  )
}

export default Dashboard