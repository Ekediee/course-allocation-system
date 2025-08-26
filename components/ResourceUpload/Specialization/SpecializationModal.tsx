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

type specializationName = string;

type SpecializationModalProps = {
  btnName: string;
  onAddSpecialization?: () => void;
};

const SpecializationModal: React.FC<SpecializationModalProps> = ({btnName, onAddSpecialization}) => {
    const [specializationName, setSpecializationName] = useState<specializationName>();
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);
    const { setIsUploading, fetchDepartmentName, fetchProgramNameByDepartment } = useAppContext();
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [selectedProgram, setSelectedProgram] = useState('')

    const { toast } = useToast()
    
    const handleCreateSpecialization = async () => {
        if(specializationName == "" || selectedDepartment == "" || selectedProgram == "") {
            toast({
            variant: "destructive",
            title: "Specialization Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }

        const specialization_data = {
            name: specializationName,
            department_id: selectedDepartment,
            program_id: selectedProgram
        };

        try {
            const res = await fetch('/api/manage-uploads/specialization', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(specialization_data),
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
                if (onAddSpecialization) onAddSpecialization();
                toast({
                    variant: "success",
                    title: "Specialization Upload Success",
                    description: data.msg,
                });

            }

            
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Specialization Upload Failed",
            description: (err as Error).message,
            });
        }
        setSpecializationName("")
        setSelectedDepartment("");
        setSelectedProgram("");
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
        formData.append('department_id', selectedDepartment);
        formData.append('program_id', selectedProgram);

        try {
        
        const res = await fetch('/api/manage-uploads/specialization/batch', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {

            if (onAddSpecialization) onAddSpecialization();
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

    const { data: departments, isLoading: isLoadingDepartments } = useQuery<Items[]>({
        queryKey: ['departments'],
        queryFn: fetchDepartmentName
    });

    const { data: programs = [], isLoading: isLoadingPrograms } = useQuery<Items[]>({
        queryKey: ['programs', selectedDepartment],
        queryFn: () => fetchProgramNameByDepartment(selectedDepartment),
        enabled: !!selectedDepartment
    });

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
                
                <DialogTitle className="">Add a Specialization</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Specify the Name, Department and Program for the Specialization
                </DialogDescription>
                </DialogHeader>
                {/* Modal body content here */}
                <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-2 ">
                    <Label htmlFor="department">Select Department</Label>
                    {!isLoadingDepartments && <ComboboxMain data={departments} onSelect={(value) => {
                        setSelectedDepartment(value)
                        setSelectedProgram("")
                    }}/>}

                    <Label htmlFor="program" className="mt-2">Select Program</Label>
                    {!isLoadingPrograms && <ComboboxMain data={programs} onSelect={setSelectedProgram}/>}

                    <Label htmlFor="specialization" className="mt-2">Specialization Name</Label>
                    <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    className="border p-2 rounded mb-2"
                    value={specializationName}
                    onChange={(e) => setSpecializationName(e.target.value)}
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
                    <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleCreateSpecialization}>Create Specialization</Button>
                    </DialogClose>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default SpecializationModal