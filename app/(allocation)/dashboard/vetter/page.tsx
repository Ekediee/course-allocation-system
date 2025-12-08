'use client'
import React from 'react'
import Welcome from '@/components/Welcome'
import RequestView from '@/components/RequestView'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import VetterStats from '@/components/Vetter/VetterStats'
import ComplianceScore from '@/components/Vetter/ComplianceScore'
import AllocationPercentage from '@/components/Vetter/AllocationPercentage'
import DepartmentStatus from '@/components/Vetter/DepartmentStatus'
import { useAppContext } from '@/contexts/ContextProvider'
import { useQuery } from '@tanstack/react-query'
// import { Items } from '@/components/ComboboxMain'

export type Items = {
  id: string;
  is_active: boolean,
  name: string;
}

const VetterDashboard = () => {
  const {
      toggleMaintenanceMode,
      isInMaintenace,
      role, 
      fetchSession
    } = useAppContext()

    const { data: session, isLoading: loadingBulletins } = useQuery<Items>({
      queryKey: ["session"],
      queryFn: fetchSession,
    });
    
  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      
      {/* Session Card */}
      <div className="flex justify-between items-center mb-6">
        <Card className="p-4 flex items-center gap-3 w-[330px] bg-gray-100">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white"><CalendarDays className="h-5 w-5 text-gray-600" /></span>
          <div>
            <p className="text-sm font-medium">Session</p>
            <p className="text-lg font-bold">{session?.name}</p>
          </div>
        </Card>
        {/* {(role === 'superadmin' && email === 'ague@babcock.edu.ng') && (
          <Button variant={isInMaintenace ? "destructive" : "default"} className="p-6 font-bold"
            onClick={toggleMaintenanceMode}
          >
            {isInMaintenace ? "Deactivate Maintenance" : "Activate Maintenance"}
          </Button>
        )} */}
        <Button className="bg-blue-600 p-6 text-white font-bold hover:bg-blue-700">
          Generate Summary Report
        </Button>
      </div>

      {/* Stats Cards */}
      <VetterStats />

      {/* Main content grid: Compliance Score, Allocation Percentage, Department Status, and Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6">
        {/* Left Section: Compliance Score and Allocation Percentage */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* <ComplianceScore /> */}
          <AllocationPercentage />
        </div>
        {/* Right Section: Department Status and Request View */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex  h-full w-full">
            {/* <div className="md:col-span-2 flex flex-col  grid grid-cols-1 md:grid-cols-4 gap-4"> */}
              <DepartmentStatus />
            {/* </div> */}
            {/* <div className="md:col-span-2 flex flex-col">
              <RequestView />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VetterDashboard