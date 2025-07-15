'use client'
import React from 'react'
import { useAppContext } from '@/contexts/ContextProvider';

const Welcome = () => {
  const {department} = useAppContext()
  return (
    <div className="mb-4 md:mb-6">
        <h2 className="text-lg font-medium">Welcome, HOD {department}</h2>
        <p className="text-orange-500 mt-1 text-sm md:text-base">
            Important: The deadline for the Course Allocation Exercise is in 2 days. 
            Please ensure you complete your allocation before this time, as the system will close.
        </p>
    </div>
  )
}

export default Welcome