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

type SessionModalProps = {
  btnName: string;
  onSessionAdded?: () => void;
};

const SessionModal: React.FC<SessionModalProps> = ({btnName, onSessionAdded}) => {
  // const {
  //   setSessionData
  // } = useAppContext()
  const [fromYear, setFromYear] = useState<fromYear>();
  const [toYear, setToYear] = useState<toYear>();
  // const [open, setOpen] = useState(false)
   const { toast } = useToast()

  const handleCreateSession = async () => {
    if(fromYear == "" || toYear == "") {
      toast({
        variant: "destructive",
        title: "Session Created Failed",
        description: "Please fill in all fields"
      })
      return;
    }else if(fromYear?.trim() === toYear?.trim()) {
      toast({
        variant: "destructive",
        title: "Session Created Failed",
        description: "Your from year and to year cannot be the same"
      })
      return;
    }

    const session_data = {
      name: `${fromYear?.trim()}/${toYear?.trim()}`,
    };
    
    try {
      const res = await fetch('/api/manage-uploads/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session_data),
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
        if (onSessionAdded) onSessionAdded();
        toast({
          variant: "success",
          title: "Session Upload Success",
          description: data.msg,
        });

      }


      
    } catch (err) {
      toast({
          variant: "destructive",
          title: "Session Upload Failed",
          description: (err as Error).message,
        });
    }
    setFromYear("");
    setToYear(""); 
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
            
            <DialogTitle className="">Create a New Session Period</DialogTitle>
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
              <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleCreateSession}>Create Session</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SessionModal