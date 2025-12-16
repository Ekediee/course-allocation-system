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


type Props = {
  is_all_pushed?: boolean;
  onSubmit: () => void;
};

const PushUMISModal = ({ is_all_pushed, onSubmit }: Props) => {
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" 
          className="bg-blue-700 hover:bg-blue-400 text-white"
          disabled={is_all_pushed}
        >
            Push All to UMIS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/images/info-icon.png" 
              alt="Info Icon" 
              className="rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=Dashboard+Preview";
              }}
            />
          </div>
          <DialogTitle className="text-center mb-2">Are you sure you want to push this Departments' allocation to UMIS?</DialogTitle>
          <DialogDescription className="text-center">
            Kindly ensure that you have carefully cross-checked the allocation and you are sure the information provided is 
            accurate. If you are unsure, kindly go back to take another look.
          </DialogDescription>
        </DialogHeader>
        {/* Modal body content here */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-center text-center border-b-2 border-gray-300 border-t-2 border-gray-300 py-2">
            <p className="text-sm text-gray-500">
              By proceeding , I confirm that I have thoroughly reviewd and verified
              the course allocation for accuracy and completeness. I understand I am responsible for any errors.
            </p>

          </div>
          {/* <input
            type="text"
            placeholder="Lecturer's Name"
            className="border p-2 rounded"
          /> */}
          <div className='flex gap-2 justify-between mt-4'>
            <DialogClose  
              className="w-full"
            asChild>
              <Button variant="outline" className="w-full">Go Back</Button>
            </DialogClose>
            <DialogClose  
              className="w-full"
            asChild>
             <Button variant="secondary" className="w-full bg-blue-700 text-white hover:bg-blue-400" onClick={onSubmit}>Continue</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PushUMISModal