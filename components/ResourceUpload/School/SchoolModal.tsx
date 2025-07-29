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
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from '@/contexts/ContextProvider'

type schoolName = string;
type schoolAcronym = string;

type SchoolModalProps = {
  btnName: string;
  onAddSchool?: () => void;
};

const SchoolModal: React.FC<SchoolModalProps> = ({btnName, onAddSchool}) => {
    const [schoolName, setSchoolName] = useState<schoolName>();
    const [schoolAcronym, setSchoolAcronym] = useState<schoolAcronym>();
    // const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleCreateSchool = async () => {
        if(schoolName == "" || schoolAcronym == "") {
            toast({
            variant: "destructive",
            title: "School Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }else if(schoolName?.trim() === schoolAcronym?.trim()) {
            toast({
            variant: "destructive",
            title: "School Creation Failed",
            description: "Your school name and acronym cannot be the same"
            })
            return;
        }

        const school_data = {
            name: schoolName,
            acronym: schoolAcronym
        };

        // console.log("School Data: ", school_data);

        try {
            const res = await fetch('/api/manage-uploads/school', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(school_data),
            });

            if (res.status.toString().startsWith("40")) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: "Something is wrong",
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                
                const data = await res.json();
                
                // Fetch session data
                if (onAddSchool) onAddSchool();
                toast({
                    variant: "success",
                    title: "School Upload Success",
                    description: data.msg,
                });

            }


            
        } catch (err) {
        toast({
            variant: "destructive",
            title: "School Upload Failed",
            description: (err as Error).message,
            });
        }
        setSchoolName("")
        setSchoolAcronym(""); 
    }

  return (
    <>
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
              
              <Plus className="h-5 w-5 " />
            
            <DialogTitle className="">Add a School Name</DialogTitle>
            </div>
            <DialogDescription className="text-center">
              Specify the Name and Acronym for the School
            </DialogDescription>
          </DialogHeader>
          {/* Modal body content here */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col text-center gap-2 ">
              <p className="text-left">School Name</p>
              <input
                type="text"
                placeholder="e.g. School of Computing"
                className="border p-2 rounded mb-2"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
              <p className="text-left">School Acronym</p>
              <input
                type="text"
                placeholder="e.g. SOC"
                className="border p-2 rounded"
                value={schoolAcronym}
                onChange={(e) => setSchoolAcronym(e.target.value)}
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
              <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleCreateSchool}>Create School</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SchoolModal