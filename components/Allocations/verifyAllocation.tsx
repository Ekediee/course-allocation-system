"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppContext } from '@/contexts/ContextProvider'

type Props = {
    onAllocate: () => void
  }

const VerifyAllocation = ({ onAllocate }: Props) => {
    const { 
        selectedCourse,
        groups, setGroups 
      } = useAppContext()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
            size="sm" 
            className="bg-blue-700 hover:bg-blue-800"
        >
            Confirm Allocation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate Lecturer</DialogTitle>
          <DialogDescription>
            You are about to assign a lecturer to this course:
            <p><b>{selectedCourse.courseCode} - {selectedCourse.courseTitle}.</b></p> 
          </DialogDescription>
        </DialogHeader>
        {/* Modal body content here */}
        <div className="flex flex-col gap-2 mt-4">
          <p>Are you sure you want to allocate: <b>{groups[0].lecturer}</b>?</p>
          {/* <Link 
              href={{
                  pathname:"/course-allocation"
              }} 
            > */}
            <div className="flex justify-start">
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800" onClick={onAllocate}>Continue</Button>
            </div>
          {/* </Link> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyAllocation