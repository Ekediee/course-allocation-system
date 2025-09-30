import React, { Suspense } from 'react'
import AllocateComponent from '@/components/Allocations/Allocate'

const Allocate = () => {
  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <AllocateComponent />
        </Suspense>
    </>
  )
}

export default Allocate