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
import React, { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/ContextProvider'
import { useToast } from "@/hooks/use-toast"

type semesterType = string;

type SemesterModalProps = {
  btnName: string;
  onAddSemester?: () => void;
};

const SemesterModal: React.FC<SemesterModalProps> = ({btnName, onAddSemester}) => {
  const [semester, setSemester] = useState<semesterType>();
  const [disableBtn, setDisableBtn] = useState(false)
  const {
    semesterData
  } = useAppContext()
  const { toast } = useToast();

  const capitalizeWords = (str: string): string => {
    return str
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if(semesterData?.length === 3){
      setDisableBtn(true)
    } 
  }, [semesterData]);

  

  // Replace multiple spaces within a string with a single space
  const normalizedSemester = semester?.toLowerCase().replace(/\s+/g, ' ').trim();
    
  const handleCreateSemester = async () => {
    if(semester == "") {
      toast({
        variant: "destructive",
        title: "Semester Creation Failed",
        description: "Please field cannot be blank/empty"
      })
      return;
    }else if(
      normalizedSemester !== "first semester" &&
      normalizedSemester !== "second semester" &&
      normalizedSemester !== "summer semester"
    ) {
      console.log("Raw semester: ", semester)
      console.log(normalizedSemester)
      toast({
        variant: "destructive",
        title: "Semester Creation Failed",
        description: "The semester name you provided is incorrect"
      })
      return;
    }

    const semester_data = {
      name: capitalizeWords(normalizedSemester),
    };

    try {
      const res = await fetch('/api/manage-uploads/semester', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(semester_data),
      });

      if (res.status.toString().startsWith("40")) {
        const data = await res.json();
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: data.error
        });
        return;
      }

      if (res.ok) {
        
        const data = await res.json();
        
        // Fetch semester data
        if (onAddSemester) onAddSemester();
        toast({
          variant: "success",
          title: "Semester Uploaded Successfully",
          description: data.msg,
        });

      }


      
    } catch (err) {
      toast({
          variant: "destructive",
          title: "Semester Upload Failed",
          description: (err as Error).message,
        });
    }

    setSemester("");
  }

  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-700 hover:bg-blue-400 text-white"
          disabled={disableBtn}
        >
          <Plus className="h-4 w-4" />
          { btnName }
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2">
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