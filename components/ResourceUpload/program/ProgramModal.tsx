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
import { SchoolType, SchoolTypes, useAppContext } from '@/contexts/ContextProvider'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fi } from "zod/v4/locales";
import { Combobox } from "@/components/ComboBox";
import { ComboboxMain, Items } from "@/components/ComboboxMain";
import { useQuery } from "@tanstack/react-query";

type programName = string;
type programAcronym = string;

type ProgramModalProps = {
  btnName: string;
  onAddProgram?: () => void;
};

const ProgramModal: React.FC<ProgramModalProps> = ({btnName, onAddProgram}) => {
    const [programName, setProgramName] = useState<programName>();
    const [programAcronym, setProgramAcronym] = useState<programAcronym>();
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { setIsUploading, fetchDepartmentName, selectedOption } = useAppContext();

    const { toast } = useToast()
    
    const handleCreateProgram = async () => {
        if(programName == "" || programAcronym == "") {
            toast({
            variant: "destructive",
            title: "program Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }else if(programName?.trim() === programAcronym?.trim()) {
            toast({
            variant: "destructive",
            title: "Program Creation Failed",
            description: "Your program name and acronym cannot be the same"
            })
            return;
        }

        const program_data = {
            name: programName,
            department_id: selectedOption,
            acronym: programAcronym
        };

        try {
            const res = await fetch('/api/manage-uploads/program', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(program_data),
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
                if (onAddProgram) onAddProgram();
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
        setProgramName("")
        setProgramAcronym(""); 
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
        formData.append('department_id', selectedOption);

        try {
        
        const res = await fetch('/api/manage-uploads/program/batch', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {

            if (onAddProgram) onAddProgram();
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

    const queryResult = useQuery<Items[]>({
            queryKey: ['departments'],
            queryFn: fetchDepartmentName
        })
    
    const { data: departments, isLoading, error } = queryResult;
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
                
                <DialogTitle className="">Add a Program Name</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Specify the Name and Acronym for the Program
                </DialogDescription>
                </DialogHeader>
                {/* Modal body content here */}
                <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-2 ">
                    <Label htmlFor="department">Select Department</Label>
                    {!isLoading && <ComboboxMain data={departments} />}

                    <Label htmlFor="program" className="mt-2">Program Name</Label>
                    <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    className="border p-2 rounded mb-2"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    required
                    />
                    <Label htmlFor="acronym">Program Acronym</Label>
                    <input
                    type="text"
                    placeholder="e.g. CS"
                    className="border p-2 rounded"
                    value={programAcronym}
                    onChange={(e) => setProgramAcronym(e.target.value)}
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
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleCreateProgram}>Create Department</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default ProgramModal