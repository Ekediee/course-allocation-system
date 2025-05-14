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

const AllocateLecturerModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-gray-500">Submit Allocation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Allocate Lecturer</DialogTitle>
          <DialogDescription>
            Assign a lecturer to this course.
          </DialogDescription>
        </DialogHeader>
        {/* Modal body content here */}
        <div className="flex flex-col gap-2 mt-4">
          <input
            type="text"
            placeholder="Lecturer's Name"
            className="border p-2 rounded"
          />
          <Link 
              href={{
                  pathname:"/course-allocation"
              }} 
            >
            <Button>Save</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AllocateLecturerModal