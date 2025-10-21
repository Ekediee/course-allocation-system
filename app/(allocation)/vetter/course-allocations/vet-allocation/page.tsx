'use client'
import { useAppContext } from '@/contexts/ContextProvider'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Semester } from "@/data/constants";
import AllocationVet from '@/components/Allocations/AllocationVet';

const VetAllocation = () => {
    // const {
    //     vetDepIDs,
    //     fetchDepAllocations
    //   } = useAppContext()

    // useEffect(() => {
    //     console.log("VetAllocation page mounted. vetDepIDs:", vetDepIDs);
    // }, [vetDepIDs]);

    // const { data: DepAllocations, isLoading, error } = useQuery<Semester[]>({
    //     queryKey: ['depcourses'], 
    //     queryFn: () => fetchDepAllocations(vetDepIDs?.semester_id, vetDepIDs?.department_id),
    // });
      
  return (
    <>
        <AllocationVet />
    </>
  )
}

export default VetAllocation