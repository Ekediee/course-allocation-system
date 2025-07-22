"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from '@/contexts/ContextProvider'

type fromYear = string;
type toYear = string;
type SemesterModalProps = {
  btnName: string;
};

const SemesterModal: React.FC<SemesterModalProps> = ({btnName}) => {
  const [semester, setSemester] = useState<fromYear>();
  const [open, setOpen] = useState(false)
//   const {
//     setToggleSemesterModal
//   } = useAppContext()
    
  const handleCreateSemester = () => {
    console.log("Creating Semester from", semester);
    setSemester("");
  }

  return (
    <>
    {/* <Button
        className="bg-blue-700 hover:bg-blue-400 text-white"
        onClick={() => setOpen(true)}
    >
        <Plus className="h-4 w-4" />
        {btnName}
    </Button> */}
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-400 text-white">
          <Plus className="h-4 w-4" />
          { btnName }
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2">
            {/* <img 
              src="/images/info-icon.png" 
              alt="Info Icon" 
              className="rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=Dashboard+Preview";
              }}
            /> */}
            <Plus className="h-5 w-5 " />
          
          <DialogTitle className="">Create a New Semester Period</DialogTitle>
          </div>
          <DialogDescription className="text-center">
            Specify the start and end year
          </DialogDescription>
        </DialogHeader>
        {/* Modal body content here */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex text-center gap-2 ">
            <input
              type="text"
              placeholder="e.g. First Semester, Second Semester, Summer Semester"
              className="border p-2 rounded w-full"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            />
          </div>
          <div className='flex gap-2 justify-between mt-4'>
            <DialogClose  
              className="w-full"
            asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DialogClose>
            <DialogClose  
              className="w-full"
            asChild>
             <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleCreateSemester}>Create Semester</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default SemesterModal