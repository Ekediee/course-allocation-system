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
import { Info, Plus } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from '@/contexts/ContextProvider'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fi } from "zod/v4/locales";

type schoolName = string;
type schoolAcronym = string;

type SchoolModalProps = {
  btnName: string;
  onAddSchool?: () => void;
};

const SchoolModal: React.FC<SchoolModalProps> = ({btnName, onAddSchool}) => {
    const [schoolName, setSchoolName] = useState<schoolName>();
    const [schoolAcronym, setSchoolAcronym] = useState<schoolAcronym>();
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { setIsUploading } = useAppContext();

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file){
        toast({
          variant: "destructive",
          title: "❌ Batch Upload Failed",
          description: 'No file selected.'
        });
        setFile(null);
        setOpen(false);
        return;
      }

      const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

      if (!isCsv) {
        toast({
          variant: "destructive",
          title: "❌ Wrong File Type",
          description: 'Please upload a valid CSV file.'
        });
        setFile(null);
        return;
      }

      setFile(file);
    };

    const handleBatchUpload = async () => {
      setIsUploading(true);
      if (!file) {
        toast({
          variant: "destructive",
          title: "❌ Batch Upload Failed",
          description: 'No file selected.'
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        
        const res = await fetch('/api/manage-uploads/school/batch', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {

          if (onAddSchool) onAddSchool();
          toast({
            variant: "success",
            title: "✅ Upload successful",
            description: data.message
          });
          
        } else {
          toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: data.error
          });
        }
      } catch (err) {
        alert('❌ Upload failed');
        console.error(err);
      }finally {
        setIsUploading(false);
        setOpen(false);
        setFile(null);
      }
    };

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
            <div className="flex flex-col gap-2 ">
              <Label htmlFor="school">School Name</Label>
              <input
                type="text"
                placeholder="e.g. School of Computing"
                className="border p-2 rounded mb-2"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
              <Label htmlFor="acronym">School Acronym</Label>
              <input
                type="text"
                placeholder="e.g. SOC"
                className="border p-2 rounded"
                value={schoolAcronym}
                onChange={(e) => setSchoolAcronym(e.target.value)}
                required
              />
            </div>
            <Badge
              variant="secondary"
              className="bg-red-500 gap-3 mt-2 text-white dark:bg-blue-600"
            >
              <Info />
              OR Use button below to upload a CSV file for batch upload.
            </Badge>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="file">Batch Upload</Label>
              <Input id="file" type="file" accept=".csv" onChange={handleFileChange} onClick={() => setOpen(true)} />
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
              <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleCreateSchool}>Create School</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SchoolModal