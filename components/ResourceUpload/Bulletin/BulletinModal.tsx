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

type fromYear = string;
type toYear = string;

type BulletinModalProps = {
  btnName: string;
  onAddBulletin?: () => void;
};

const BulletinModal: React.FC<BulletinModalProps> = ({btnName, onAddBulletin}) => {
  // const {
  //   setSessionData
  // } = useAppContext()
  const [fromYear, setFromYear] = useState<fromYear>();
  const [toYear, setToYear] = useState<toYear>();
  // const [open, setOpen] = useState(false)
   const { toast } = useToast()

  const handleCreateBulletin = async () => {
    if(fromYear == "" || toYear == "") {
      toast({
        variant: "destructive",
        title: "Bulletin Creation Failed",
        description: "Please fill in all fields"
      })
      return;
    }else if(fromYear?.trim() === toYear?.trim()) {
      toast({
        variant: "destructive",
        title: "Bulletin Creation Failed",
        description: "Your from year and to year cannot be the same"
      })
      return;
    }

    const bulletin_data = {
      name: `${fromYear?.trim()} - ${toYear?.trim()}`,
      start_year: fromYear,
      end_year: toYear
    };
    
    try {
      const res = await fetch('/api/manage-uploads/bulletin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bulletin_data),
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
        if (onAddBulletin) onAddBulletin();
        toast({
          variant: "success",
          title: "Bulletin Upload Success",
          description: data.msg,
        });

      }


      
    } catch (err) {
      toast({
          variant: "destructive",
          title: "Bulletin Upload Failed",
          description: (err as Error).message,
        });
    }
    setFromYear("");
    setToYear(""); 
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
            
            <DialogTitle className="">Create a New Bulletin Period</DialogTitle>
            </div>
            <DialogDescription className="text-center">
              Specify the start and end year
            </DialogDescription>
          </DialogHeader>
          {/* Modal body content here */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="From year"
                className="border p-2 rounded w-full"
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                required
              />
              <span className="font-semibold">-</span>
              <input
                type="text"
                placeholder="To year"
                className="border p-2 rounded w-full"
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
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
              <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleCreateBulletin}>Create Bulletin</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BulletinModal